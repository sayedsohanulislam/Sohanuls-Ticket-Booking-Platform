import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Transaction from "../models/Transaction.js";
import { asyncHandler, createError } from "../middleware/errorHandler.js";
import { markBookingPaid } from "./bookingController.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

// POST /api/payments/create-intent  — user creates a PaymentIntent for an accepted booking
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  if (!bookingId) throw createError("bookingId is required", 400);

  const booking = await Booking.findById(bookingId);
  if (!booking) throw createError("Booking not found", 404);
  if (booking.user.toString() !== req.user._id.toString()) {
    throw createError("Not authorized", 403);
  }
  if (booking.status !== "accepted") {
    throw createError("Booking must be accepted before payment", 400);
  }
  const ticket = await Booking.findById(booking._id).populate("ticket");
  if (ticket && new Date(ticket.ticket.departureDate).getTime() < Date.now()) {
    throw createError("Departure time has passed, payment not allowed", 400);
  }

  const amount = Math.round(booking.totalPrice * 100); // cents
  const intent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata: { bookingId: booking._id.toString(), userId: req.user._id.toString() },
  });

  res.json({ clientSecret: intent.client_secret, amount, bookingId });
});

// POST /api/payments/confirm  — called from the client after Stripe confirms
// In production you should rely on Stripe webhooks instead of client confirmation
export const confirmPayment = asyncHandler(async (req, res) => {
  const { bookingId, paymentIntentId } = req.body;
  if (!bookingId || !paymentIntentId) {
    throw createError("bookingId and paymentIntentId are required", 400);
  }
  const booking = await Booking.findById(bookingId).populate("ticket");
  if (!booking) throw createError("Booking not found", 404);
  if (booking.user.toString() !== req.user._id.toString()) {
    throw createError("Not authorized", 403);
  }

  // Verify with Stripe
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (intent.status !== "succeeded") {
    throw createError(`Payment not completed: ${intent.status}`, 400);
  }

  // Save transaction
  await Transaction.create({
    user: booking.user,
    booking: booking._id,
    ticketTitle: booking.ticket.title,
    amount: booking.totalPrice,
    stripePaymentIntentId: paymentIntentId,
  });

  // Mark booking paid + reduce ticket quantity
  await markBookingPaid(bookingId, paymentIntentId);

  res.json({ message: "Payment successful" });
});

// GET /api/payments/transactions  — user's transaction history
export const myTransactions = asyncHandler(async (req, res) => {
  const items = await Transaction.find({ user: req.user._id })
    .sort({ paymentDate: -1 });
  res.json({ items });
});

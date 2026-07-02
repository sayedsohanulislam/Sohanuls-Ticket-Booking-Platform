import Booking from "../models/Booking.js";
import Ticket from "../models/Ticket.js";
import { asyncHandler, createError } from "../middleware/errorHandler.js";

// POST /api/bookings  — user creates a booking request
export const createBooking = asyncHandler(async (req, res) => {
  const { ticketId, quantity } = req.body;
  if (!ticketId || !quantity) {
    throw createError("ticketId and quantity are required", 400);
  }
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw createError("Ticket not found", 404);
  if (ticket.verificationStatus !== "approved") {
    throw createError("Ticket is not approved for booking", 400);
  }
  if (new Date(ticket.departureDate).getTime() < Date.now()) {
    throw createError("Departure time has already passed", 400);
  }
  if (Number(quantity) > ticket.quantity) {
    throw createError("Booking quantity exceeds available ticket quantity", 400);
  }

  const booking = await Booking.create({
    ticket: ticket._id,
    user: req.user._id,
    vendor: ticket.vendor,
    quantity: Number(quantity),
    unitPrice: ticket.price,
    totalPrice: ticket.price * Number(quantity),
    status: "pending",
  });

  res.status(201).json({ booking });
});

// GET /api/bookings/mine  — user's booked tickets
export const myBookings = asyncHandler(async (req, res) => {
  const items = await Booking.find({ user: req.user._id })
    .populate("ticket")
    .sort({ createdAt: -1 });
  res.json({ items });
});

// GET /api/bookings/requests  — vendor sees booking requests for their tickets
export const vendorRequests = asyncHandler(async (req, res) => {
  const items = await Booking.find({ vendor: req.user._id })
    .populate("ticket", "title from to departureDate image")
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 });
  res.json({ items });
});

// PATCH /api/bookings/:id/accept  — vendor accepts
export const acceptBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("ticket");
  if (!booking) throw createError("Booking not found", 404);
  if (booking.vendor.toString() !== req.user._id.toString()) {
    throw createError("Not authorized", 403);
  }
  if (booking.status !== "pending") {
    throw createError(`Booking already ${booking.status}`, 400);
  }
  booking.status = "accepted";
  await booking.save();
  res.json({ booking });
});

// PATCH /api/bookings/:id/reject  — vendor rejects
export const rejectBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw createError("Booking not found", 404);
  if (booking.vendor.toString() !== req.user._id.toString()) {
    throw createError("Not authorized", 403);
  }
  if (booking.status !== "pending") {
    throw createError(`Booking already ${booking.status}`, 400);
  }
  booking.status = "rejected";
  await booking.save();
  res.json({ booking });
});

// After Stripe success: mark as paid and reduce ticket quantity
export async function markBookingPaid(bookingId, paymentIntentId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw createError("Booking not found", 404);
  booking.status = "paid";
  await booking.save();

  const ticket = await Ticket.findById(booking.ticket);
  if (ticket) {
    ticket.quantity = Math.max(0, ticket.quantity - booking.quantity);
    await ticket.save();
  }
  return booking;
}

// DELETE /api/bookings/:id/cancel — user cancels booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw createError("Booking not found", 404);
  if (booking.user.toString() !== req.user._id.toString()) {
    throw createError("Not authorized to cancel this booking", 403);
  }
  if (booking.status !== "pending") {
    throw createError("Booking cannot be cancelled once accepted or rejected", 400);
  }
  await booking.deleteOne();
  res.json({ message: "Booking cancelled successfully" });
});


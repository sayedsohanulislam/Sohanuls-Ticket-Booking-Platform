import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import Booking from "../models/Booking.js";
import Transaction from "../models/Transaction.js";
import { asyncHandler, createError } from "../middleware/errorHandler.js";

// GET /api/users/me
export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ user });
});

// PUT /api/users/me  — update profile
export const updateMe = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;
  await user.save();
  res.json({ user });
});

// GET /api/users  — admin only, list all users
export const list = asyncHandler(async (_req, res) => {
  const items = await User.find().sort({ createdAt: -1 });
  res.json({ items });
});

// PATCH /api/users/:id/role  — admin promotes user
export const changeRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["user", "vendor", "admin"].includes(role)) {
    throw createError("Invalid role", 400);
  }
  const user = await User.findById(req.params.id);
  if (!user) throw createError("User not found", 404);
  user.role = role;
  await user.save();
  res.json({ user });
});

// PATCH /api/users/:id/fraud  — admin marks vendor as fraud
export const markFraud = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw createError("User not found", 404);
  if (user.role !== "vendor") {
    throw createError("Only vendors can be marked as fraud", 400);
  }
  user.isFraud = !user.isFraud;
  await user.save();

  // If marking as fraud, hide all their tickets
  if (user.isFraud) {
    await Ticket.updateMany(
      { vendor: user._id },
      { verificationStatus: "rejected" }
    );
  }
  res.json({ user });
});

// GET /api/users/vendor/revenue  — vendor revenue overview
export const vendorRevenue = asyncHandler(async (req, res) => {
  const ticketsCount = await Ticket.countDocuments({ vendor: req.user._id });
  const sold = await Booking.find({
    vendor: req.user._id,
    status: "paid",
  });
  const ticketsSold = sold.reduce((sum, b) => sum + b.quantity, 0);
  const revenue = sold.reduce((sum, b) => sum + b.totalPrice, 0);
  // group revenue by transport type for chart
  const byTypeAgg = await Booking.aggregate([
    { $match: { vendor: req.user._id, status: "paid" } },
    {
      $lookup: {
        from: "tickets",
        localField: "ticket",
        foreignField: "_id",
        as: "t",
      },
    },
    { $unwind: "$t" },
    {
      $group: {
        _id: "$t.transportType",
        count: { $sum: "$quantity" },
        revenue: { $sum: "$totalPrice" },
      },
    },
  ]);
  res.json({
    ticketsAdded: ticketsCount,
    ticketsSold,
    revenue,
    breakdown: byTypeAgg,
  });
});

import Ticket from "../models/Ticket.js";
import Booking from "../models/Booking.js";
import { asyncHandler, createError } from "../middleware/errorHandler.js";

// GET /api/tickets  — public, only approved tickets, with search / filter / sort / pagination
export const listTickets = asyncHandler(async (req, res) => {
  const {
    from,
    to,
    transportType,
    sort,
    page = 1,
    limit = 6,
  } = req.query;

  const filter = { verificationStatus: "approved", quantity: { $gt: 0 } };
  if (from) filter.from = { $regex: from, $options: "i" };
  if (to) filter.to = { $regex: to, $options: "i" };
  if (transportType && transportType !== "all") {
    filter.transportType = transportType;
  }

  let query = Ticket.find(filter);
  if (sort === "asc") query = query.sort({ price: 1 });
  else if (sort === "desc") query = query.sort({ price: -1 });
  else query = query.sort({ createdAt: -1 });

  const skip = (Number(page) - 1) * Number(limit);
  query = query.skip(skip).limit(Number(limit));
  const items = await query.populate("vendor", "name email");
  const total = await Ticket.countDocuments(filter);

  res.json({
    items,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total,
  });
});

// GET /api/tickets/advertised
export const advertised = asyncHandler(async (_req, res) => {
  const items = await Ticket.find({
    verificationStatus: "approved",
    isAdvertised: true,
  })
    .sort({ createdAt: -1 })
    .limit(6);
  res.json({ items });
});

// GET /api/tickets/latest
export const latest = asyncHandler(async (_req, res) => {
  const items = await Ticket.find({ verificationStatus: "approved" })
    .sort({ createdAt: -1 })
    .limit(8);
  res.json({ items });
});

// GET /api/tickets/:id
export const getTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate(
    "vendor",
    "name email avatar"
  );
  if (!ticket) throw createError("Ticket not found", 404);
  res.json({ ticket });
});

// POST /api/tickets  — vendor only
export const createTicket = asyncHandler(async (req, res) => {
  if (req.user.role !== "vendor" && req.user.role !== "admin") {
    throw createError("Only vendors can add tickets", 403);
  }
  if (req.user.isFraud) {
    throw createError("Account flagged as fraud, cannot add tickets", 403);
  }
  const {
    title,
    from,
    to,
    transportType,
    price,
    quantity,
    departureDate,
    perks,
    image,
  } = req.body;

  if (!title || !from || !to || !transportType || !price || !departureDate) {
    throw createError("Missing required ticket fields", 400);
  }

  const ticket = await Ticket.create({
    title,
    from,
    to,
    transportType,
    price: Number(price),
    quantity: Number(quantity),
    departureDate,
    perks: Array.isArray(perks) ? perks : [],
    image,
    vendor: req.user._id,
    vendorName: req.user.name,
    vendorEmail: req.user.email,
  });

  res.status(201).json({ ticket });
});

// PUT /api/tickets/:id  — owner vendor or admin
export const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw createError("Ticket not found", 404);

  const isOwner =
    ticket.vendor.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    throw createError("Not authorized to update this ticket", 403);
  }
  if (ticket.verificationStatus === "rejected") {
    throw createError("Rejected tickets cannot be edited", 400);
  }

  const updatable = [
    "title",
    "from",
    "to",
    "transportType",
    "price",
    "quantity",
    "departureDate",
    "perks",
    "image",
  ];
  updatable.forEach((k) => {
    if (req.body[k] !== undefined) ticket[k] = req.body[k];
  });

  const updated = await ticket.save();
  res.json({ ticket: updated });
});

// DELETE /api/tickets/:id
export const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw createError("Ticket not found", 404);

  const isOwner =
    ticket.vendor.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    throw createError("Not authorized to delete this ticket", 403);
  }
  if (ticket.verificationStatus === "rejected") {
    throw createError("Rejected tickets cannot be deleted", 400);
  }

  await ticket.deleteOne();
  res.json({ message: "Ticket deleted" });
});

// PATCH /api/tickets/:id/verify  — admin only, approves / rejects
export const verifyTicket = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) {
    throw createError("Status must be 'approved' or 'rejected'", 400);
  }
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw createError("Ticket not found", 404);
  ticket.verificationStatus = status;
  await ticket.save();
  res.json({ ticket });
});

// PATCH /api/tickets/:id/advertise  — admin only, toggles advertise
export const toggleAdvertise = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw createError("Ticket not found", 404);
  if (ticket.verificationStatus !== "approved") {
    throw createError("Only approved tickets can be advertised", 400);
  }
  // If turning on, ensure not more than 6 advertised
  if (!ticket.isAdvertised) {
    const count = await Ticket.countDocuments({
      isAdvertised: true,
      verificationStatus: "approved",
    });
    if (count >= 6) {
      throw createError("Cannot advertise more than 6 tickets at a time", 400);
    }
  }
  ticket.isAdvertised = !ticket.isAdvertised;
  await ticket.save();
  res.json({ ticket });
});

// GET /api/tickets/vendor/mine  — vendor's own tickets
export const myTickets = asyncHandler(async (req, res) => {
  const items = await Ticket.find({ vendor: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ items });
});

// GET /api/tickets/admin/all  — admin only, all tickets regardless of status
export const allForAdmin = asyncHandler(async (_req, res) => {
  const items = await Ticket.find()
    .populate("vendor", "name email")
    .sort({ createdAt: -1 });
  res.json({ items });
});

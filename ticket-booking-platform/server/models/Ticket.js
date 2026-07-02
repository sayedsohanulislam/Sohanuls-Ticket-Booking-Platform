import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    transportType: {
      type: String,
      enum: ["bus", "train", "launch", "plane"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 1 },
    departureDate: { type: Date, required: true },
    perks: {
      type: [String],
      default: [],
    },
    image: { type: String, default: "" },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendorName: { type: String, required: true },
    vendorEmail: { type: String, required: true },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isAdvertised: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast search by route
ticketSchema.index({ from: 1, to: 1, transportType: 1 });

export default mongoose.model("Ticket", ticketSchema);

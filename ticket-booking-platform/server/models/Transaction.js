import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    ticketTitle: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "usd" },
    stripePaymentIntentId: { type: String, required: true },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, paymentDate: -1 });

export default mongoose.model("Transaction", transactionSchema);

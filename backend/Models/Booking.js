import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  seatNumbers: { type: [String], required: true },
  totalAmount: { type: Number, required: true },
  utrNumber: { type: String },
  paymentStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  transactionScreenshot: { type: String },
  status: { type: String, enum: ["booked", "cancelled"], default: "booked" }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);

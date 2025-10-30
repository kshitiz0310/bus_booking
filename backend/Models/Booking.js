import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  seatNumbers: { type: [String], required: true },
  status: { type: String, enum: ["booked", "cancelled"], default: "booked" }
});

export default mongoose.model("Booking", bookingSchema);

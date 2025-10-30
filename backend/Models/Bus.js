import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  exam: { type: String, required: true },
  city: { type: String, required: true },
  date: { type: String, required: true },
  busNumber: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  bookedSeats: { type: [String], default: [] }
});

export default mongoose.model("Bus", busSchema);

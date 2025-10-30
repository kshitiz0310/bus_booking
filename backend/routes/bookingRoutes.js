import express from "express";
import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";
import { protect, adminOnly } from "../Middleware/authMiddleware.js";

const router = express.Router();

// User: Create booking
router.post("/", protect, async (req, res) => {
  const { busId, seatNumbers } = req.body;

  const booking = await Booking.create({
    userId: req.user.id,
    busId,
    seatNumbers,
  });

  await Bus.findByIdAndUpdate(busId, {
    $push: { bookedSeats: { $each: seatNumbers } },
  });

  res.json(booking);
});

// User: Get my bookings
router.get("/my", protect, async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id }).populate("busId");
  res.json(bookings);
});

// Admin: Get all bookings (filter by city/date)
router.get("/", protect, adminOnly, async (req, res) => {
  const { city, date, busId } = req.query;

  let filter = {};
  if (busId) filter.busId = busId;

  let bookings = await Booking.find(filter)
    .populate("busId")
    .populate("userId", "name email");

  if (city) bookings = bookings.filter((b) => b.busId.city === city);
  if (date) bookings = bookings.filter((b) => b.busId.date === date);

  res.json(bookings);
});

// Admin: Report
router.get("/report", protect, adminOnly, async (req, res) => {
  const buses = await Bus.find();
  const report = [];

  for (const bus of buses) {
    const bookings = await Booking.find({ busId: bus._id });
    report.push({
      bus: bus.busNumber,
      exam: bus.exam,
      city: bus.city,
      date: bus.date,
      totalSeats: bus.totalSeats,
      booked: bookings.reduce((sum, b) => sum + b.seatNumbers.length, 0),
    });
  }

  res.json(report);
});

// Cancel booking (User or Admin)
router.delete("/:id", protect, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (req.user.role !== "admin" && booking.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to cancel this booking" });
  }

  booking.status = "cancelled";
  await booking.save();

  await Bus.findByIdAndUpdate(booking.busId, {
    $pull: { bookedSeats: { $in: booking.seatNumbers } },
  });

  res.json({ message: "Booking cancelled", booking });
});

export default router;

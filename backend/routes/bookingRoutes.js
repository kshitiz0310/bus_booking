import express from "express";
import multer from "multer";
import path from "path";
import Booking from "../Models/Booking.js";
import { Bus } from "../Models/Bus.js";
import { protect, adminOnly } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/transactions/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Get bus seats info
router.get("/seats/:busId", protect, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    
    res.json({
      capacity: bus.capacity,
      bookedSeats: bus.bookedSeats,
      fare: bus.fare
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User: Create booking with payment
router.post("/", protect, upload.single('transactionScreenshot'), async (req, res) => {
  try {
    const { busId, seatNumbers, totalAmount, utrNumber } = req.body;

    const parsedSeats = JSON.parse(seatNumbers);

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const bookedSeats = bus.bookedSeats || [];

    // check for already booked seats
    const unavailableSeats = parsedSeats.filter(s => bookedSeats.includes(s));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats ${unavailableSeats.join(', ')} are already booked`
      });
    }

    // create booking
    const booking = await Booking.create({
      userId: req.user.id,
      busId,
      seatNumbers: parsedSeats,
      totalAmount,
      utrNumber,
      transactionScreenshot: req.file ? req.file.filename : null,
      paymentStatus: "pending"
    });

    // update bus bookedSeats only (NO seatsAvailable manipulation)
    await Bus.findByIdAndUpdate(busId, {
      $push: { bookedSeats: { $each: parsedSeats } }
    });

    res.json(booking);

  } catch (error) {
    console.error("Booking Error:", error.message);
    res.status(500).json({ message: error.message });
  }
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

// Admin: Verify payment
router.patch("/:id/verify", protect, adminOnly, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    booking.paymentStatus = paymentStatus;
    await booking.save();
    
    res.json({ message: "Payment status updated", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete booking (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await Bus.findByIdAndUpdate(booking.busId, {
      $pull: { bookedSeats: { $in: booking.seatNumbers } },
      $inc: { seatsAvailable: booking.seatNumbers.length }
    });

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking (User or Admin)
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role !== "admin" && booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    await Bus.findByIdAndUpdate(booking.busId, {
      $pull: { bookedSeats: { $in: booking.seatNumbers } },
      $inc: { seatsAvailable: booking.seatNumbers.length }
    });

    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

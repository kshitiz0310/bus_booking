import express from "express";
import { Bus } from "../Models/Bus.js";
import { protect, adminOnly } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Add bus (Admin)
router.post("/", protect, adminOnly, async (req, res) => {
  const bus = await Bus.create(req.body);
  res.json(bus);
});

// Get single bus by ID
router.get("/:id", async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all buses or search buses
router.get("/", async (req, res) => {
  const { from, to, date, ac, nonAc } = req.query;

  let filter = {};

  if (from) filter.startPoint = new RegExp(from, 'i');
  if (to) filter.destination = new RegExp(to, 'i');
  if (date) filter.date = date;

  if (ac === '1' && nonAc === '0') filter.ac = true;
  if (nonAc === '1' && ac === '0') filter.ac = false;

  const buses = await Bus.find(filter);
  res.json(buses);
});

// Delete bus
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Bus.findByIdAndDelete(req.params.id);
  res.json({ message: "Bus deleted" });
});

export default router;

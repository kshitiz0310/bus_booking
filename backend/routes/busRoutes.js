import express from "express";
import Bus from "../models/Bus.js";
import { protect, adminOnly } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Add bus (Admin)
router.post("/", protect, adminOnly, async (req, res) => {
  const bus = await Bus.create(req.body);
  res.json(bus);
});

// Get all buses
router.get("/", async (req, res) => {
  const buses = await Bus.find();
  res.json(buses);
});

// Delete bus
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Bus.findByIdAndDelete(req.params.id);
  res.json({ message: "Bus deleted" });
});

export default router;

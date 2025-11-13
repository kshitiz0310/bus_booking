import express from "express";
import User from "../Models/User.js";
import { protect, adminOnly } from "../Middleware/authMiddleware.js";

const router = express.Router();

//  Get all users (Admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password"); // hide password
  res.json(users);
});

// Update user role (Admin only)
router.put("/:id/role", protect, adminOnly, async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  res.json(user);
});

// Delete user (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
});

export default router;

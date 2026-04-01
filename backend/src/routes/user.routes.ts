import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { User } from "../models/user.model";

const router = express.Router();

// Get own profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user: any = await User.findByPk((req as any).user.id, {
      attributes: ['id', 'name', 'username', 'email', 'bio', 'role', 'createdAt']
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Update own profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, username, bio } = req.body;
    await User.update({ name, username, bio }, { where: { id: (req as any).user.id } });
    const updated: any = await User.findByPk((req as any).user.id, {
      attributes: ['id', 'name', 'username', 'email', 'bio', 'role', 'createdAt']
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Get all users (Admin only)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const role = (req as any).user.role;
    if (role !== 'Admin') return res.status(403).json({ message: "Admin access required" });
    const users = await User.findAll({
      attributes: ['id', 'name', 'username', 'email', 'role', 'createdAt']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Delete user (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const role = (req as any).user.role;
    if (role !== 'Admin') return res.status(403).json({ message: "Admin access required" });
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;
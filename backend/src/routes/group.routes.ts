import express from "express";
import { createGroup, getGroups, joinGroup } from "../controllers/group.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { Group } from "../models/group.model";

const router = express.Router();

router.post("/create", authMiddleware, createGroup);
router.get("/", authMiddleware, getGroups);
router.post("/join", authMiddleware, joinGroup);

// Delete group (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const role = (req as any).user.role;
    if (role !== 'Admin') return res.status(403).json({ message: "Admin access required" });
    await Group.destroy({ where: { id: req.params.id } });
    res.json({ message: "Group deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting group" });
  }
});

export default router;
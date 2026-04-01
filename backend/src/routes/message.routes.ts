import express from "express";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// GET CHAT HISTORY for a group
router.get("/:groupId", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await Message.findAll({
      where: { groupId },
      order: [["createdAt", "ASC"]],
      include: [{ model: User, attributes: ['id', 'name', 'username'] }]
    });
    
    // Map to flatten user data into each message
    const formatted = messages.map((msg: any) => {
      const m = msg.toJSON();
      return {
        ...m,
        userName: m.userName || m.User?.username || m.User?.name || `User ${m.userId}`,
        displayName: m.User?.name || m.userName || `User ${m.userId}`
      };
    });
    
    res.json(formatted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// GET ALL MESSAGES (Admin/Moderator only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const role = (req as any).user.role;
    if (role !== 'Admin' && role !== 'Moderator') return res.status(403).json({ message: "Access denied" });
    const messages = await Message.findAll({
      order: [["createdAt", "DESC"]],
      limit: 200
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// DELETE message (Admin/Moderator only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const role = (req as any).user.role;
    if (role !== 'Admin' && role !== 'Moderator') return res.status(403).json({ message: "Access denied" });
    await Message.destroy({ where: { id: req.params.id } });
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message" });
  }
});

export default router;
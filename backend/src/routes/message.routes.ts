import express from "express";
import { Message } from "../models/message.model";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// GET CHAT HISTORY
router.get("/:groupId", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await Message.findAll({
      where: { groupId },
      order: [["createdAt", "ASC"]]
    });

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

export default router;
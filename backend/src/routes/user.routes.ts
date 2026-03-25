import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to protected route 🔐",
    user: (req as any).user
  });
});

export default router;
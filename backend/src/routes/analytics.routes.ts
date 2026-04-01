import express from "express";
import { getAnalytics } from "../controllers/analytics.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, getAnalytics);

export default router;

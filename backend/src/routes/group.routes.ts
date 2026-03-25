import express from "express";
import { createGroup, getGroups, joinGroup } from "../controllers/group.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/create", authMiddleware, createGroup);
router.get("/", authMiddleware, getGroups);
router.post("/join", authMiddleware, joinGroup);

export default router;
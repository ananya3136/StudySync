import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.middleware";
import { File } from "../models/file.model";
import { User } from "../models/user.model";
import { sendEmail } from "../utils/mailer";

const router = express.Router();

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ CORRECT ROUTE
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = (req as any).user.id;

    const user: any = await User.findByPk(userId);

    const file = await File.create({
      filename: req.file?.filename,
      path: req.file?.path,
      groupId,
      userId
    });

    // ✅ EMAIL INSIDE FUNCTION
    await sendEmail(
      user.email,
      "File Uploaded 📁",
      "Your file was uploaded successfully!"
    );

    res.json({
      message: "File uploaded & email sent ✅",
      file
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Upload error" });
  }
});

export default router;
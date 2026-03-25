import express from "express";
import { sendEmail } from "../utils/mailer";

const router = express.Router();

router.get("/email", async (req, res) => {
  try {
    await sendEmail(
      "ananyasharma1029@gmail.com",     
      "Test Email 🚀",                
      "StudySync email is working!"    
    );

    res.json({ message: "Email sent successfully ✅" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Email failed ❌" });
  }
});

export default router;
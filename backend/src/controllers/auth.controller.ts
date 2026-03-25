import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ✅ REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json(user);

  } catch (error) {
  console.log("REGISTER ERROR:", error);  // 🔥 VERY IMPORTANT
  res.status(500).json({ message: "Error registering user" });
}
};

// ✅ LOGIN (THIS IS WHAT YOU ARE MISSING)
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: any = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json("User not found");

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return res.status(401).json("Invalid password");

    const token = jwt.sign({ id: user.id }, "SECRET", {
      expiresIn: "1d"
    });

    res.json({ token });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};
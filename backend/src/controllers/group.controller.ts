import { Request, Response } from "express";
import { Group } from "../models/group.model";
import { User } from "../models/user.model";
import { sendEmail } from "../utils/mailer";

// Create Group
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const group = await Group.create({ name, description });

    res.status(201).json(group);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating group" });
  }
};

// Get All Groups
export const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.findAll();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups" });
  }
};

// Join Group
export const joinGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.body;
    const userId = (req as any).user.id;

    const user: any = await User.findByPk(userId);
    const group: any = await Group.findByPk(groupId);

    if (!group) return res.status(404).json("Group not found");

    await user.addGroup(group);

    console.log("Sending email to:", user.email); // ✅ correct place

    await sendEmail(
      user.email,
      "Joined Study Group 🎉",
      `You have joined the group: ${group.name}`
    );

    res.json({ message: "Joined group + email sent ✅" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error joining group" });
  }
};
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Group } from "../models/group.model";
import { Message } from "../models/message.model";

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.count();
    const activeGroups = await Group.count();
    const messagesSent = await Message.count();

    res.json({ totalUsers, activeGroups, messagesSent });
  } catch (error) {
    console.log("ANALYTICS ERROR:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};

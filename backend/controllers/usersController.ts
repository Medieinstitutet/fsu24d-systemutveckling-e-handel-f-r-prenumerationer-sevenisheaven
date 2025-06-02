import { Request, Response } from "express";

import User from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
  try { 
    const user = await User.find().populate('subscription_id');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email }).populate('subscription_id');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    await User.insertMany(req.body);
    res.json({ message: "Created User" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    await User.updateOne({ email: email }, { ...req.body });

    res.json({ message: `Update User With ${email}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    await User.deleteOne({ email: email });

    res.json({ message: `Deleted User With ${email}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User";

let ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password.toString(), user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Credentials" });
    }

    const userInfo = { email: user.email, role: user.role };

    const refreshToken = jwt.sign(userInfo, ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    await User.updateOne(
      { email: user.email },
      {
        $set: {
          token: refreshToken,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    const accessToken = jwt.sign(userInfo, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    res.json({
      user: { email: userInfo.email, role: user.role },
      expires_in: 60 * 15,
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const oldToken = req.cookies?.refreshToken;

  if (!oldToken || !ACCESS_TOKEN_SECRET) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const user = await User.findOne({ token: oldToken });

    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const userInfo = { email: user.email, role: user.role };

    const newRefreshToken = jwt.sign(userInfo, ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    await User.updateOne(
      { _id: user._id },
      { $set: { token: newRefreshToken } }
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    const accessToken = jwt.sign(userInfo, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    res.json({
      user: {
        email: user.email,
        role: user.role,
      },
      expires_in: 60 * 15,
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { email, role } = req.user;

  res.json({
    user: { email, role },
  });
};

export const clearToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  try {
    if (token) {
      await User.updateOne({ token }, { $set: { token: "" } });
    }

    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Token cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const user = await User.find().populate("subscription_id");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email }).populate("subscription_id");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = { ...rest, password: hashedPassword };

    const createdUser = await User.create(data);

    // Skicka tillbaka användaren utan lösenord
    const { password: _, ...userWithoutPassword } = createdUser.toObject();

    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const { password, ...rest } = req.body; 

    const updateData: any = { ...rest };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    } 

    const result = await User.updateOne({ email }, { $set: updateData });

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or data unchanged" });
    }

    res.json({ message: `Updated user with email: ${email}` });
  } catch (error: any) {
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

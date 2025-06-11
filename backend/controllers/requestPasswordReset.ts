import crypto from 'crypto';
import User from '../models/User';
import { sendEmail } from '../utils/emailService';

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const token = crypto.randomBytes(32).toString('hex');
  user.token = token;

  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail(
    user.email,
    "Password Reset",
    `<h1>Reset your password</h1><p><a href="${resetLink}">Click here</a> to reset your password</p>`,
    `Reset your password: ${resetLink}`
  );

  res.json({ message: "Reset link sent" });
};


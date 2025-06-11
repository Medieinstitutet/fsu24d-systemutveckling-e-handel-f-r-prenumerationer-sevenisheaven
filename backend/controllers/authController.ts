import bcrypt from 'bcrypt';
import User from '../models/User';

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password)
    return res.status(400).json({ error: "Token and password are required" });

  const user = await User.findOne({ token });
  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.token = undefined; 

  await user.save();

  res.json({ message: "Password has been reset successfully" });
};
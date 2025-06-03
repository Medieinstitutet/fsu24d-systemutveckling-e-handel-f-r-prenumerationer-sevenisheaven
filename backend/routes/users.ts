import { Router } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../middleware/auth";
import {
  login,
  getMe,
  refreshToken,
  clearToken,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
} from "../controllers/usersController";

const router = Router();

// Public routes
router.post("/login", login);
router.post("/refresh-token", verifyRefreshToken, refreshToken);
router.post("/clear-token", clearToken);

// Authenticated route to get current user
router.get("/me", verifyRefreshToken, getMe);

// Protected user management routes
router.get("/", verifyAccessToken, getUsers);
router.get("/:email", verifyAccessToken, getUserByEmail);
router.post("/", verifyAccessToken, createUser);
router.patch("/:email", verifyAccessToken, updateUser);
router.delete("/:email", verifyAccessToken, deleteUser);

export default router;
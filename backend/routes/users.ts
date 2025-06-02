import { Router } from "express";
import { verifyRefreshToken } from "../middleware/auth";
import { 
  login,
  refreshToken,
  clearToken,
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  
  getUserByEmail
} from "../controllers/usersController";
  
const router = Router();

router.post("/login", login);
router.post("/refresh-token", verifyRefreshToken, refreshToken);
router.post("/clear-token", clearToken);

router.get("/", getUsers)
router.get("/:email", getUserByEmail)
router.post("/", createUser)
router.patch("/:email", updateUser)
router.delete("/:email", deleteUser)

export default router
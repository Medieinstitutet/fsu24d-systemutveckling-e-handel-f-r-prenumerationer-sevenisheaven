import express from "express";
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  getUserByEmail
} from "../controllers/usersController";
  
const router = express.Router();

router.get("/", getUsers)
router.get("/:email", getUserByEmail)
router.post("/", createUser)
router.patch("/:email", updateUser)
router.delete("/:email", deleteUser)

export default router
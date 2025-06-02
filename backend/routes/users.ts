import express from "express";
import { 
  getUsers, 
  getUsersById, 
  createUsers, 
  updateUsers, 
  deleteUsers,
  getUsersByEmail
} from "../controllers/usersController";
  
const router = express.Router();

router.get("/", getUsers)
router.get("/:id", getUsersById)
router.get("/email/:email", getUsersByEmail)
router.post("/", createUsers)
router.patch("/:id", updateUsers)
router.delete("/:id", deleteUsers)

export default router
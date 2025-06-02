import express from "express";

import { 
  getRoles, 
  getRoleById, 
} from "../controllers/roleController";
  
const router = express.Router();

router.get("/", getRoles)
router.get("/:id", getRoleById)

export default router
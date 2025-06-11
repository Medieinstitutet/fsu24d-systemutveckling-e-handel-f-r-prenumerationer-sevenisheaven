import express from "express";
import { 
 requestPasswordReset 
   } from "../controllers/requestPasswordReset";
import { resetPassword } from "../controllers/authController";

const router = express.Router();

router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router
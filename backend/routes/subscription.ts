import express from "express";

import { 
  getSubscriptions, 
  getSubscriptionById, 
} from "../controllers/subscriptionController.ts";
  
const router = express.Router();

router.get("/", getSubscriptions)
router.get("/:id", getSubscriptionById)
import express from "express";

import { 
  getSubscriptions, 
  getSubscriptionById, 
} from "../controllers/subscriptionsController";
  
const router = express.Router();

router.get("/", getSubscriptions)
router.get("/:id", getSubscriptionById)

export default router
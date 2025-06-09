import { Router } from "express";
import {
  checkoutSessionEmbedded, getSession,
  updateSubscription,
  webhook,
} from "../controllers/stripeController";
const router = Router();

router.post("/create-checkout-session-embedded", checkoutSessionEmbedded);
router.post("/update-subscription", updateSubscription);
router.get("/sessions/:sessionId", getSession);
router.post("/webhook", webhook);

export default router;

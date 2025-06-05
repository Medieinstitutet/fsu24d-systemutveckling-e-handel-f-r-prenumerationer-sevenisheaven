import { Router } from "express";
import {
  checkoutSessionEmbedded, getSession,
  webhook,
} from "../controllers/stripeController";
const router = Router();

router.post("/create-checkout-session-embedded", checkoutSessionEmbedded);
router.get("/sessions/:sessionId", getSession);
router.post("/webhook", webhook);

export default router;

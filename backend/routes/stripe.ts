import { Router } from "express";
import {
  checkoutSessionEmbedded, getSession,
  testFailedPayment,
  webhook,
} from "../controllers/stripeController";
const router = Router();

router.post("/create-checkout-session-embedded", checkoutSessionEmbedded);
router.get("/sessions/:sessionId", getSession);
router.post("/webhook", webhook);
router.get("/webhook/test-failed-payment", testFailedPayment);

export default router;

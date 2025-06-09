import { Router } from "express";
import { getPaymentIntent, webhook, paymentIntent } from "../controllers/stripeController";
const router = Router();

router.get("/sessions/:sessionId", getPaymentIntent);
router.post("/webhook", webhook);
router.post("/create-payment-intent", paymentIntent);
router.post("/renew-payment-intent", paymentIntent);


export default router;

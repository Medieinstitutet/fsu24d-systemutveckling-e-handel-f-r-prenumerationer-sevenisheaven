import { Router } from "express";
import {
  checkoutSessionEmbedded,
 /*  webhook, */
} from "../controllers/stripeController";
const router = Router();

router.post("/create-checkout-session-embedded", checkoutSessionEmbedded);
/* router.post("/webhook", webhook); */

export default router;

import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/User";
import { Request, Response } from "express";
dotenv.config();
import {
  sendConfirmationEmail,
  sendChangeEmail,
  sendFailureEmail,
  sendPaymentSuccesEmail,
} from "../utils/emailService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkoutSessionEmbedded = async (req, res) => {
  try {
    const { user, subscription } = req.body;

    const priceLookup = {
      "68380950c659b1a48ce18927": process.env.PRODUCT_1,
      "68380992c659b1a48ce18928": process.env.PRODUCT_2,
      "683809b3c659b1a48ce18929": process.env.PRODUCT_3,
    };

    const selectedPrice = priceLookup[subscription];
    if (!selectedPrice)
      return res.status(400).json({ error: "Invalid plan ID" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ui_mode: "embedded",
      line_items: [
        {
          price: selectedPrice,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      client_reference_id: subscription,
      return_url: `${process.env.CLIENT_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

export const updateSubscription = async (req, res) => {
  const { currentStripeSubscriptionId, subscriptionId, email } = req.body;

  const priceLookup = {
    "68380950c659b1a48ce18927": process.env.PRODUCT_1,
    "68380992c659b1a48ce18928": process.env.PRODUCT_2,
    "683809b3c659b1a48ce18929": process.env.PRODUCT_3,
  };

  const newPlanId = priceLookup[subscriptionId];
  if (!newPlanId) return res.status(400).json({ error: "Invalid plan ID" });

  const subscription = await stripe.subscriptions.retrieve(
    currentStripeSubscriptionId
  );
  const subscriptionItemId = subscription.items.data[0].id;

  await User.updateOne(
    { email },
    { $set: { subscription_id: subscriptionId } }
  );

  await sendChangeEmail(email, subscriptionId);

  const updatedSub = await stripe.subscriptions.update(
    currentStripeSubscriptionId,
    {
      cancel_at_period_end: false,
      proration_behavior: "create_prorations",
      billing_cycle_anchor: "now",
      items: [
        {
          id: subscriptionItemId,
          price: newPlanId,
        },
      ],
    }
  );

  res.json({
    success: true,
    stripe_subscription_id: updatedSub.id,
  });
};

export const getSession = async (req, res) => {
  const sessionId = req.params.sessionId;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing session ID" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({
      email: session.customer_email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  const { subscriptionId, email } = req.body;

  const canceledSubscription = await stripe.subscriptions.update(
    subscriptionId,
    {
      cancel_at_period_end: true,
    }
  );

  const endTimestamp = canceledSubscription.cancel_at; // Unix timestamp in seconds
  const endDate = new Date(endTimestamp * 1000); // Convert to JS Date
  await User.updateOne(
    { email },
    {
      $set: {
        subscription_status: "cancelling",
        subscription_ends_at: endDate,
      },
    }
  );
  res.json({
    success: true,
    message: "Subscription set to cancel at the end of the billing period.",
    subscriptionEndsAt: endTimestamp,
  });
};
export const resumeSubscription = async (req: Request, res: Response) => {
  const { subscriptionId, email } = req.body;

  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });

  await User.updateOne(
    { email },
    {
      $set: {
        subscription_status: "payment_successfull",
        subscription_ends_at: null,
      },
    }
  );
};

export const webhook = async (req, res) => {
  const event = req.body;

  try {
    if (event.type === "checkout.session.completed") {
      const session = await stripe.checkout.sessions.retrieve(
        event.data.object.id
      );
      const customerEmail = session.customer_email;
      const subscriptionId = session.client_reference_id;
      const stripeSubscriptionId = session.subscription;

      await User.updateOne(
        { email: customerEmail },
        {
          $set: {
            subscription_id: subscriptionId,
            stripe_subscription_id: stripeSubscriptionId,
            subscription_status: "payment_successfull",
          },
        }
      );
      const user = await User.findOne({ email: customerEmail });
      if (user) {
        await sendConfirmationEmail(user);
      }
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      const customer = await stripe.customers.retrieve(subscription.customer);

      if (!("deleted" in customer)) {
        const email = customer.email;

        await User.updateOne(
          { email: email },
          {
            $set: {
              subscription_id: null,
              subscription_status: "cancelled",
              subscription_ends_at: null,
            },
          }
        );
      }
    } else if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;
      const email = invoice.customer_email;
      const hostedInvoiceUrl = invoice.hosted_invoice_url;

      const user = await User.findOne({ email });

      if (user) {
        await User.updateOne(
          { email },
          {
            $set: {
              subscription_status: "payment_failed",
              retry_payment_url: hostedInvoiceUrl,
            },
          }
        );
        await sendFailureEmail(user, hostedInvoiceUrl);
      }

    } else if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;
      const email = invoice.customer_email;
      const user = await User.findOne({ email });

      if (user) {
        await User.updateOne(
          { email },
          { $set: { subscription_status: "payment_successfull", retry_payment_url: null } }
        );
        await sendPaymentSuccesEmail(user);
      }
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

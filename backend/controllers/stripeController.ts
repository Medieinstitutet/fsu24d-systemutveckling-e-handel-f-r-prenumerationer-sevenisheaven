import nodemailer from "nodemailer";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/User";
import { Request, Response, RequestHandler } from "express";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const sendConfirmationEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Subscription Confirmation - ${user.subscription_id}`,
    text: `Hello ${user.firstname}, your order with ID ${user.subscription_id} has been successfully placed. Thank you for shopping with us!`,
    html: `
      <h1>Thank you for your order, ${user.firstname}!</h1>
      <p>Your order with ID <strong>${user.subscription_id}</strong> has been successfully placed and is being processed.</p>
      <p>We will notify you once your order is shipped.</p>
      <h2>THIS IS JUST A TEST!</h2>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};
const sendFailureEmail = async (user, hostedInvoiceUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Missed Payment`,
    text: `Hello ${user.firstname}, There was a problem with your latest payment`,
    html: `
      <h1>Pay your remaining balance here, ${hostedInvoiceUrl}!</h1>
      <p>Your subscription will be terminated otherwise</p>
      <h2>THIS IS JUST A TEST!</h2>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Failure email sent successfully");
  } catch (error) {
    console.error("Error sending failure email:", error);
  }
};

export const checkoutSessionEmbedded = async (req, res) => {
  try {
    const { user, subscription } = req.body;
    // console.log("Incoming user:", user, subscription);

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
      return_url: `http://localhost:5173/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
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

// export const cancelSubscription = async (req: Request, res: Response) => {
//   const {subscriptionId} = req.body;

//   const canceledSubscription = await stripe.subscriptions.del(subscriptionId);
// };

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
    } else if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;

      const subscriptionId = invoice.subscription;
      const email = invoice.customer_email;
      const hostedInvoiceUrl = invoice.hosted_invoice_url;

      const user = await User.findOne({ email });

      if (user) {
        await User.updateOne(
          { email },
          { $set: { subscription_status: "payment_failed" } }
        );

        await sendFailureEmail(user, hostedInvoiceUrl);
      }

      console.log(`Payment failed for subscription ${subscriptionId}`);
    } else if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;
      const email = invoice.customer_email;
      const user = await User.findOne({ email });

      if (user) {
        await User.updateOne(
          { email },
          { $set: { subscription_status: "payment_successfull" } }
        );
        await sendConfirmationEmail(user);
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

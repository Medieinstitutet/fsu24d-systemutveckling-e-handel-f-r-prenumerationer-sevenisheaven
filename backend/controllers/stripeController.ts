import nodemailer from "nodemailer";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/User"; 
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

const sendMissedPaymentMail = async (user, url) => {
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
      <h1>Pay your remaining balance here, ${url}!</h1>
      <p>Your subscription will be terminated otherwise</p>
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

export const paymentIntent = async (req, res) => {
  const { user, subscription } = req.body;

  const priceLookup = {
    "68380950c659b1a48ce18927": 1499,
    "68380992c659b1a48ce18928": 1699,
    "683809b3c659b1a48ce18929": 1899,
  };

  const selectedAmount = priceLookup[subscription];
  if (!selectedAmount)
    return res.status(400).json({ error: "Invalid plan ID" });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: selectedAmount,
      currency: "eur",
      description: `Subscription: ${subscription}`,
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        email: user.email,
        subscription,
      },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe error:", error.message);
    res.status(500).send({ error: error.message });
  }
};

export const getPaymentIntent = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing PaymentIntent ID" });
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(id);

    res.json({
      status: intent.status,
      amount: intent.amount,
      currency: intent.currency,
      email: intent.metadata?.email,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const webhook = async (req, res) => {
  const event = req.body;

  try {
    if (event.type === "payment_intent.succeeded") {
      const session = await stripe.checkout.sessions.retrieve(event.data.object.id);
      const customerEmail = session.customer_email;
      const subscriptionId = session.client_reference_id;

      await User.updateOne(
        { email: customerEmail },
        { $set: { subscription_id: subscriptionId } }
      );

      const user = await User.findOne({ email: customerEmail });
      if (user) {
        await sendConfirmationEmail(user);
      }

    }
    /* if (event.type === "invocie.payment_succeeded") {
      //reset set interval 
    } */
    if (event.type === "payment_intent.payment_failed") {
      const invocie = await stripe.invoices.retrieve(event.data.object.id);
      const customerEmail = invocie.customer_email;
      const url = invocie.hosted_invoice_url;
      const user = await User.findOne({ email: customerEmail });
      if (user) {
        await sendMissedPaymentMail(user, url);
      }
      //Setinterval, subscription_id = null 
    }
      else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
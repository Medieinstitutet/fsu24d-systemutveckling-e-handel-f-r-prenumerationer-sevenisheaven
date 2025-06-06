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

export const checkoutSessionEmbedded = async (req, res) => {
  try {
    const { user, subscription } = req.body;
    console.log("Incoming user:", user, subscription);

    const priceLookup = {
      "68380950c659b1a48ce18927": "price_1RWKJlFC5bkJD5ptYDKSLaOB", // DINA PRODUKTER
      "68380992c659b1a48ce18928": "price_1RWKKfFC5bkJD5ptmCpERpx7", // DINA PRODUKTER
      "683809b3c659b1a48ce18929": "price_1RWKPqFC5bkJD5ptwepxVk8e", // DINA PRODUKTER
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

export const webhook = async (req, res) => {
  const event = req.body;

  try {
    if (event.type === "checkout.session.completed") {
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

    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
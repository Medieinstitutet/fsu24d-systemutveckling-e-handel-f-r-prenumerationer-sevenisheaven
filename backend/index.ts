import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Stripe from "stripe";

import productsRouter from "./routes/products";
import subscriptionsRouter from "./routes/subscription";
import usersRouter from "./routes/users";
import stripeRouter from "./routes/stripe";
import BackgroundTask from "../backend/models/BackgroundTask";

const app = express();

app.use(cors({
  // origin: "*", 
  // fick felmeddelande när jag loggade in:
  // Cross-Origin Request Blocked: The Same Origin Policy disallows reading 
  // the remote resource at ‘http://localhost:3000/users/login’. 
  // (Reason: Credential is not supported if the CORS header ‘Access-Control-Allow-Origin’ is ‘*’).
  
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/subscriptions", subscriptionsRouter);
app.use("/stripe", stripeRouter);

app.get("/", (_, res) => {
  res.send({ message: "Api running" });
});

// --------------------------------STRIPE--------------------------------------

const stripe = new Stripe(
  "sk_test_51R4KznRteeBh27q3OWioLwkbmUtD57IXN3Mt3gU9uXUBOBnRTQnjSziy8Wls8pJt9JtT613SSNvYhMKBt76lhklY00rDZRLC04"
);
app.get("/create-checkout-session", async (_, res) => {
  const session = await stripe.checkout.sessions.create({
    success_url:
      "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
    line_items: [
      {
        price: "price_1RWXiKRteeBh27q378nLCeKn",
        quantity: 1,
      },
    ],
    mode: "subscription",
  });

  res.send({ session });
});

app.get("/verify-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(
    "cs_test_a1YvuYIlsDH5R4u0TgB4RCAHMfpRcxzPdAgYMVe7GtiRpBI3w8jyL2Mle1"
  );

  const subscriptionId = session.subscription;

  if (session.status === "complete") {
    //spara sub id i db
  }
  res.send(session);
});

app.post("/stripe-webhook", async (req, res) => {
  console.log(req.body);

  const type = req.body.type;
  switch (type) {
    case "checkout.session.completed":
      // do something
      break;
    case "invoice.payment_failed":
      // hämta sub id
      // markera subscription som ej betald
      // Hämta betallänk
      break;
    // invoice.payment_succeeded
  }

  res.send({});
});
// --------------------------------STRIPE--------------------------------------

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL || "");
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`The server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }

/* 
  setInterval(async () => {
  try {
    const tasks = await BackgroundTask.find({ status: 0 });

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const id = task._id;
      const type = task.type;
      console.log("Task ID:", id, "Type:", type);

      let isOk = true;

      switch (type) {
        case "test":
          console.log("test");
          break;
        case "sendInvetation":
          console.log("sendInvetation");
          let data = JSON.parse(task.data)
          sendEmail(data.email)
          console.log(data);
          break;
        default:
          console.warn("No Type Named: " + type);
          isOk = false; 
          break;
      }

      await BackgroundTask.findOneAndUpdate(
        { _id: id },
        { $set: { status: isOk ? 1 : 2 } }
      );
    }
  } catch (error) {
    console.error("Error fetching background tasks:", error);
  }
}, 1000); */
};

connect();

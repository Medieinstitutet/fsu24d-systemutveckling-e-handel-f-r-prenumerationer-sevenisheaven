import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import productsRouter from "./routes/products";
import subscriptionsRouter from "./routes/subscription";
import usersRouter from "./routes/users";
import stripeRouter from "./routes/stripe";
import passwordRouter from "./routes/password";
import BackgroundTask from "../backend/models/BackgroundTask";

const app = express();

app.use(cors({
  // origin: "*", 
  // fick felmeddelande när jag loggade in:
  // Cross-Origin Request Blocked: The Same Origin Policy disallows reading 
  // the remote resource at ‘http://localhost:3000/users/login’. 
  // (Reason: Credential is not supported if the CORS header ‘Access-Control-Allow-Origin’ is ‘*’).
  // test array. this way, we can deploy remotely as well
  origin: ['https://medieinstitutet.github.io', 'http://localhost:5173'],
  // origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/subscriptions", subscriptionsRouter);
app.use("/stripe", stripeRouter);
app.use("/password", passwordRouter);

app.get("/", (_, res) => {
  res.send({ message: "Api running" });
});


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
};

connect();

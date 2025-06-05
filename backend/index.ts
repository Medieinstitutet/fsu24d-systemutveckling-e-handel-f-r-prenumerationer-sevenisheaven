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
import BackgroundTask from "../backend/models/BackgroundTask";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/subscriptions", subscriptionsRouter);
app.use("/stripe", stripeRouter);

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

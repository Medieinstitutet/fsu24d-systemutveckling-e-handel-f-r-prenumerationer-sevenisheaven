import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import productsRouter from "./routes/products";
/* import subscriptionsRouter from "./controllers/subscriptions";
import usersRouter from "./controllers/users"; */

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productsRouter);
/* app.use("/users", usersRouter);
app.use("/subscriptions", subscriptionsRouter); */

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
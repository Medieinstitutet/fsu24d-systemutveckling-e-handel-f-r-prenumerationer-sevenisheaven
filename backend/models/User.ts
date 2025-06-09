import { Schema, model, Types } from "mongoose";

const User = new Schema({
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  postal_code: {
    type: String,
    required: true,
  },
  street_address: {
    type: String,
    required: true,
  },
  subscription_id: {
    type: Types.ObjectId || null,
    required: true,
    ref: "subscriptions",
    default: () => new Types.ObjectId("68380950c659b1a48ce18927"),
  },
  token: {
    type: String,
    default: "", 
  },
 role: {
    type: String,
    enum: ["admin", "customer"],
    required: true,
    default: "customer",
  },
});

export default model("users", User);
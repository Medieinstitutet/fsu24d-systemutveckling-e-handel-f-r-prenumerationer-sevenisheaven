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
    type: Types.ObjectId,
    required: false,
    ref: "subscriptions",
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
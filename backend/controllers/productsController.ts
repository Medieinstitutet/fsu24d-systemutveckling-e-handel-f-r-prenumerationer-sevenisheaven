import { Request, Response } from "express";

import Product from "../models/Product";
import Subscription from "../models/Subscription";

const SUBSCRIPTION_HIERARCHY = [
  "Sock Emergency",
  "Sock & Roll",
  "Sock Royalty",
];

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { subscriptionTier } = req.query;

    let query = Product.find();

    const subscriptionQuery = Subscription.find();
    const subscriptions = await subscriptionQuery;

    const asd = subscriptions.map((s) => {
      if (s._id.toString() === subscriptionTier) {
        return s.tier;
      }
    });

    if (subscriptionTier === "1") {
      query = query.populate({
        path: "subscription_id",
        match: { tier: subscriptionTier },
      });
    } else if (subscriptionTier === "2") {
      query = query.populate({
        path: "subscription_id",
        match: { tier: { $lte: subscriptionTier } },
      });
    } else {
      query = query.populate("subscription_id");
    }

    const products = await query;

    const filtered = subscriptionTier
      ? products.filter((p) => p.subscription_id !== null)
      : products;


    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("subscription_id");
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    await Product.insertMany(req.body);
    res.json({ message: "Created Product" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Product.updateOne({ _id: id }, { ...req.body });

    res.json({ message: `Update Product With ${id}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Product.deleteOne({ _id: id });

    res.json({ message: `Deleted Product With ${id}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

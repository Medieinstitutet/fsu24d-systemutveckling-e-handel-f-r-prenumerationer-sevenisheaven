import { Product } from "../models/Products";
import { handleRequest, api } from "./baseService";

const SUBSCRIPTIONS_ENDPOINT = "/subscriptions";


export const fetchSubscriptions = async () => {
  return handleRequest<Product>(api.get(`${SUBSCRIPTIONS_ENDPOINT}`));
};
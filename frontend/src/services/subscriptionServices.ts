import { Product } from "../models/Products";
import { handleRequest, api } from "./baseService";

const SUBSCRIPTIONS_ENDPOINT = "/subscriptions";


export const fetchSubscriptions = async () => {
  return handleRequest<Product["subscription_id"][]>(api.get(`${SUBSCRIPTIONS_ENDPOINT}`));
};
export const fetchSubscriptionById = async (id: string) => {
  return handleRequest<Product["subscription_id"]>(api.get(`${SUBSCRIPTIONS_ENDPOINT}/${id}`));
};
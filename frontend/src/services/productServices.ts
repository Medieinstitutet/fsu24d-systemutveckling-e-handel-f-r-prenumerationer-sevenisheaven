import { IProductCreate, IProductUpdate, Product } from "../models/Products";
import { api, handleRequest } from "./baseService";
const PRODUCT_ENDPOINT = "/products";

export const fetchAllProducts = async (
  subscriptionId: string,
  page = 1,
  limit: number
) => {
  let url = `${PRODUCT_ENDPOINT}?page=${page}&limit=${limit}`;
  if (subscriptionId) url += `&subscriptionId=${subscriptionId}`;

  return handleRequest<Product[]>(api.get(url));
};

export const fetchProduct = async (id: string) => {
  return handleRequest<Product>(api.get(`${PRODUCT_ENDPOINT}/${id}`));
};

export const createProduct = async (payload: IProductCreate) => {
  return handleRequest<Product>(api.post(PRODUCT_ENDPOINT, payload));
};

export const updateProduct = async (id: string, payload: IProductUpdate) => {
  return handleRequest<Product>(
    api.patch(`${PRODUCT_ENDPOINT}/${id}`, payload)
  );
};

export const deleteProduct = async (id: string) => {
  return handleRequest(api.delete(`${PRODUCT_ENDPOINT}/${id}`));
};

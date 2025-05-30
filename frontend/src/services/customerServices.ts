import { ICustomerCreate, ICustomerUpdate, Customer } from "../models/Customer";
import { api, handleRequest } from "./baseService";
const CUSTOMERS_ENDPOINT = "/customers";

export const fetchAllCustomers = async (searchEmail: string) => {
  const query = searchEmail ? `?searchEmail=${searchEmail}` : "";
  return handleRequest<Customer[]>(api.get(`${CUSTOMERS_ENDPOINT}${query}`));
};

export const fetchCustomerByEmail = async (email: string) => {
  return handleRequest<Customer>(api.get(`${CUSTOMERS_ENDPOINT}/${email}`));
};

export const createCustomer = async (payload: ICustomerCreate) => {
  return handleRequest<Customer>(api.post(CUSTOMERS_ENDPOINT, payload));
};

export const updateCustomer = async (
  email: string,
  payload: ICustomerUpdate
) => {
  return handleRequest<Customer>(
    api.patch(`${CUSTOMERS_ENDPOINT}/${email}`, payload)
  );
};

export const deleteCustomer = async (email: string) => {
  return handleRequest(api.delete(`${CUSTOMERS_ENDPOINT}/${email}`));
};

import { IUserCreate, IUserUpdate, Users } from "../models/Users";
import { api, handleRequest } from "./baseService";
const USERS_ENDPOINT = "/users";

export const fetchUserByEmail = async (email: string) => {
  return handleRequest<Users>(api.get(`${USERS_ENDPOINT}/${email}`));
};

export const createUser = async (payload: IUserCreate) => {
  return handleRequest<Users>(api.post(USERS_ENDPOINT, payload));
};

export const updateUser = async (email: string, payload: IUserUpdate) => {

  return handleRequest<Users>(api.patch(`${USERS_ENDPOINT}/${email}`, payload));
};

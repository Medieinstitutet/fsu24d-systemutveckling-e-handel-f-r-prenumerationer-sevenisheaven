import axios from "axios";
import { API_URL } from "./baseService";
import { User } from "../models/User";

axios.defaults.withCredentials = true;

export type tokenResponseType = {
  user: User;
  expires_in: number;
  token: string;
};

export const signInToken = async (
  username: string,
  password: string
): Promise<tokenResponseType> => {
  try {
    const response = await axios.post<tokenResponseType>(
      `${API_URL}/auth/login`,
      { username, password }
    );
    return response.data;
  } catch (error) {
    logAxiosError(error, "Login");
    throw error;
  }
};

export const refreshToken = async (): Promise<tokenResponseType> => {
  try {
    const response = await axios.post<tokenResponseType>(
      `${API_URL}/auth/refresh-token`
    );
    return response.data;
  } catch (error) {
    logAxiosError(error, "Token refresh");
    throw error;
  }
};

export const clearTokens = async () => {
  try {
    await axios.post(`${API_URL}/auth/clear-token`);
  } catch (error) {
    logAxiosError(error, "Token clear");
    throw error;
  }
};

const logAxiosError = (error: unknown, context: string) => {
  if (axios.isAxiosError(error)) {
    console.error(
      `${context} Axios error:`,
      error.response?.data || error.message
    );
  } else {
    console.error(`${context} Unexpected error:`, error);
  }
};

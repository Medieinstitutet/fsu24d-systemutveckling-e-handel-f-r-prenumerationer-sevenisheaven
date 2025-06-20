import axios, { AxiosResponse } from "axios";
export const API_URL = window.location.hostname === "medieinstitutet.github.io" ? "https://fsu24d-systemutveckling-e-handel-f-r.onrender.com" : "http://localhost:3000"; /* http://localhost:5000 */

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleRequest = async <T>(request: Promise<AxiosResponse<T>>) => {
  try {
    const response: { data: T } = await request;    
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

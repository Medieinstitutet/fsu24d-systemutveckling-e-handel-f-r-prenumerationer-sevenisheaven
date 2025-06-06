import { FormEvent, useState } from "react";
import { Users, IUserUpdate, IUserCreate } from "../models/Users";
import {
  createUser,
  updateUser,
  fetchUserByEmail,
} from "../services/userServices";
import { saveToLocalStorage } from "../utils/localStorage";

export const useUser = () => {
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchUserByEmailHandler = async (email: string) => {
    try {
      const data = await fetchUserByEmail(email);
      setUser(data ?? null);
      return data ?? null;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return null;
    }
  };

  const createUserHandler = async (
    payload: IUserCreate
  ) => {
    setLoading(true);
    try {
      const newUser = await createUser(payload);
      setUser(newUser);
      return newUser;
    } catch (error) {
      setError("Failed to create Customer");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserHandler = async (
    email: string,
    userUpdate: IUserUpdate
  ) => {
    if (!userUpdate) return;
    setLoading(true);
    try {
      const updatedUser = await updateUser(email, userUpdate);
      saveToLocalStorage("customer", updatedUser);
    } catch (error) {
      setError("Failed to update Customer");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };


  return {
    createUserHandler,
    updateUserHandler,
    fetchUserByEmailHandler,
    user,
    loading,
    error,
  };
};

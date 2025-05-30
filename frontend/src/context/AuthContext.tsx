import { createContext, PropsWithChildren, useState } from "react";
import { User } from "../models/User";
import { API_URL } from "../services/baseService";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  refreshToken: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL + "/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      setUser({ username: data.user.username });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    fetch(API_URL + "/auth/logout", { method: "POST", credentials: "include" });
  };

  const refreshToken = async () => {
    try {
      const res = await fetch(API_URL + "/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ username: data.user.username });
      }
    } catch (error) {
      console.error("Refresh token error:", error);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const res = await fetch(API_URL + "/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data?.message || "Registration failed";
        throw new Error(errorMessage);
      }

      setUser({ username: data.user.username });
    } catch (error) {
      console.error("Registration error:", error);
      throw error; 
    }
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, register, refreshToken, user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

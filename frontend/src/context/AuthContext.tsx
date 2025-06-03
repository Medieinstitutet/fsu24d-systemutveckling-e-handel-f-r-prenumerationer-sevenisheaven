import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { User } from "../models/User";
import { API_URL } from "../services/baseService";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, expectedRole: "admin" | "customer") => Promise<void>;
  logout: () => void;
  refreshToken: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
    refreshToken(); // try to restore session on page load
  }, []);

  
  const login = async (
  email: string, 
  password: string, 
  expectedRole: "customer" | "admin"
) => {
  setIsLoading(true);
  try {
    const res = await fetch(API_URL + "/users/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Login failed");
    }

    if (data.user.role !== expectedRole) {
      throw new Error(`You do not have permission to login as ${expectedRole}`);
    }

    setUser({ email: data.user.email, role: data.user.role });
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

 const logout = async () => {
  setUser(null);
  try {
    await fetch(`${API_URL}/users/clear-token`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout failed", err);
  }
};

  const refreshToken = async () => {
    try {
      const res = await fetch(API_URL + "/users/refresh-token", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ email: data.user.email, role: data.user.role });
      }
    } catch (error) {
      console.error("Refresh token error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, refreshToken, user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

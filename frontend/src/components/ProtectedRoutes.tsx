import { PropsWithChildren } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";


const ProtectedRoutes = ({ children, role }: { children: JSX.Element, role?: "admin" | "customer" }) => {

 const { user } = useAuth();

  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/unauthorized" />;
  return children;
};

export default ProtectedRoutes;

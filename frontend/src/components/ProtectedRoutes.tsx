import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type ProtectedRoutesProps = {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "customer")[];
};

const ProtectedRoutes = ({ children, allowedRoles }: ProtectedRoutesProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/blocked" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedLayout = () => {
  const location = useLocation();
  const { data: authData, isLoading } = useAuth();
  console.log("authData", authData);
  console.log("loading", isLoading);

  if (!isLoading && !authData) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const PublicLayout = () => {
  const { data: authData, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (authData) return <Navigate to="/" replace />;

  return <Outlet />;
};

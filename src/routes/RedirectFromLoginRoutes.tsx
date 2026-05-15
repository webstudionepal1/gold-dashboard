import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FrontendRoutes } from "./routes";
import { LoginPage } from "../screens/auth/LoginPage";
export const ProtectedLoginPage = () => {
  const { data: authData } = useAuth();
  if (authData) {
    return <Navigate to={FrontendRoutes.HOME} replace />;
  }
  return <LoginPage />;
};

"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "@/App";
import { LoginPage } from "@/screens/auth/LoginPage";
import { ProtectedLayout } from "@/routes/ProtectedAppRoutes";
import { PublicLayout } from "@/routes/PublicLayout";
import { routesConfig } from "@/routes/Routes-Config";
import { initializeAuth } from "@/hooks/useAuth";

const renderRoutes = (routes: typeof routesConfig) =>
  routes.map(({ path, element }) => (
    <Route key={path} path={path} element={element} />
  ));

export default function ClientApp() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const authData = initializeAuth();
    queryClient.setQueryData(["auth"], authData);
  }, [queryClient]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<App />}>
            {renderRoutes(routesConfig)}
          </Route>
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

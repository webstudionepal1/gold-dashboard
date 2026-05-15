import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import ErrorBoundary from "./components/ui/ErrorHandler.tsx";
import "./index.css";
import { LoginPage } from "./screens/auth/LoginPage";
import { ProtectedLayout } from "./routes/ProtectedAppRoutes.tsx";
import { PublicLayout } from "./routes/PublicLayout.tsx";
import { routesConfig } from "./routes/Routes-Config.tsx";
import { ReactQueryProvider } from "./server/providers/QuerryClientProviders.tsx";
import { NotificationProvider } from "./contexts/NotificationContext.tsx";

const renderRoutes = (routes: any[]) =>
  routes.map(({ path, element, children }) => (
    <Route key={path} path={path} element={element}>
      {children && renderRoutes(children)}
    </Route>
  ));

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <ReactQueryProvider>
      <NotificationProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              {/* Protected Routes */}
              <Route element={<ProtectedLayout />}>
                <Route path="/" element={<App />}>
                  {renderRoutes(routesConfig)}
                </Route>
              </Route>

              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<LoginPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <ToastContainer
            position="top-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover={false}
            toastClassName="font-semibold"
            theme="colored"
            className="z-[999999999999999999]"
          />
        </ErrorBoundary>
      </NotificationProvider>
    </ReactQueryProvider>
  // </StrictMode>
);

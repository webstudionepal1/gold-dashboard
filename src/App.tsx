import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/shared";
import Sidebar, { SidebarInset } from "./components/shared/sidebar/Sidebar";
import { SidebarProvider } from "./components/shared/sidebar/SidebarContext";
import CriticalNotificationBanner from "./components/shared/CriticalNotificationBanner";
import { initializeAuth } from "./hooks/useAuth";
import useFirebaseMessaging from "./hooks/useFirebaseMessaging";
import { SidebarConfig } from "./routes/Sidebar";

export default function App() {
  const queryClient = useQueryClient();

  // Initialize Firebase messaging
  useFirebaseMessaging();

  useEffect(() => {
    const authData = initializeAuth();
    queryClient.setQueryData(["auth"], authData);
  }, [queryClient]);

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar config={SidebarConfig} />
        <SidebarInset className="max-h-screen p-2 space-y-2 overflow-y-auto bg-gray-50">
          {/* Critical Notification Banner - Re-enabled after fixing infinite loop issues */}
          <CriticalNotificationBanner />

          <Navbar />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

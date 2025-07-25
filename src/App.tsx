import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/shared";
import Sidebar, { SidebarInset } from "./components/shared/sidebar/Sidebar";
import { SidebarProvider } from "./components/shared/sidebar/SidebarContext";
import CriticalNotificationBanner from "./components/shared/CriticalNotificationBanner";
import { initializeAuth } from "./hooks/useAuth";
import { SidebarConfig } from "./routes/Sidebar";
import useCriticalNotifications from "./hooks/useCriticalNotifications";

export default function App() {
  const queryClient = useQueryClient();
  const { criticalNotifications, dismissNotification, markAsRead } =
    useCriticalNotifications();

  useEffect(() => {
    const authData = initializeAuth();
    queryClient.setQueryData(["auth"], authData);
  }, [queryClient]);

  return (
    <SidebarProvider>
      {/* Critical Notification Banner - positioned at the very top */}
      <CriticalNotificationBanner
        notifications={criticalNotifications}
        onDismiss={dismissNotification}
        onMarkAsRead={markAsRead}
      />

      <div className="flex">
        <Sidebar config={SidebarConfig} />
        <SidebarInset className="max-h-screen p-2 space-y-2 overflow-y-auto bg-gray-50">
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

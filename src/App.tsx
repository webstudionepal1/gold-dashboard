import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Sidebar, { SidebarInset } from "./components/shared/sidebar/Sidebar";
import { initializeAuth } from "./hooks/useAuth";
import { SidebarConfig } from "./routes/Sidebar";
import { SidebarProvider } from "./components/shared/sidebar/SidebarContext";
import { Navbar } from "./components/shared";
import { Outlet } from "react-router-dom";

export default function App() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const authData = initializeAuth();
    queryClient.setQueryData(["auth"], authData);
  }, [queryClient]);

  return (
    <SidebarProvider>
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

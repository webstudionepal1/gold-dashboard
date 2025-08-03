import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tab";
import Pagination from "../_table/_Pagination";
import NotificationCard from "./NotificationCard";
// import { useGetNotifications } from "@/server/api/push-notifications";
// import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface FormattedNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  showCheckbox: boolean;
  showStatusDot: boolean;
  statusColor: string;
  isRead: boolean;
  type: string;
  priority: string;
}

const NotificationTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // const { data: authData } = useAuth();
  const authData: { user?: string | object } | null = null; // Temporary fallback

  // Get user ID from auth data
  const userId = useMemo(() => {
    if (!(authData as any)?.user) return null;

    try {
      let userData;
      const userProp = (authData as any).user;
      if (typeof userProp === "string") {
        // Try to parse JSON string, but handle cases where it might be "[object Object]"
        if (userProp === "[object Object]") {
          console.error("Invalid user data format: [object Object]");
          return null;
        }
        userData = JSON.parse(userProp);
      } else {
        userData = userProp;
      }
      return userData?._id;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }, [authData]);

  // Fetch notifications from API - temporarily disabled
  // const {
  //   data: notificationsResponse,
  //   isLoading,
  //   error,
  // } = useGetNotifications(userId, itemsPerPage, currentPage);

  // Temporary fallback
  const notificationsResponse: {
    data?: any[] | { data?: any[]; pagination?: { total?: number } };
    total?: number;
  } | null = null;
  const isLoading = false;
  const error = null;

  // Handle different response structures - ensure notifications is always an array
  const notifications = Array.isArray((notificationsResponse as any)?.data)
    ? (notificationsResponse as any)?.data
    : (notificationsResponse as any)?.data?.data || [];

  // Get total items count from the appropriate response structure
  const totalItems =
    (notificationsResponse as any)?.total ||
    (notificationsResponse as any)?.data?.pagination?.total ||
    0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  // Helper function to format notification data for NotificationCard
  const formatNotification = (notification: any): FormattedNotification => ({
    id: notification._id,
    title: notification.title,
    description:
      typeof notification.body === "string"
        ? notification.body
        : JSON.stringify(notification.body),
    time: formatTimeAgo(new Date(notification.createdAt)),
    showCheckbox: true,
    showStatusDot: !notification.isRead,
    statusColor: getPriorityColor(notification.priority || "medium"),
    isRead: notification.isRead,
    type: notification.type,
    priority: notification.priority,
  });

  // Helper function to format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hour${
        Math.floor(diffInSeconds / 3600) > 1 ? "s" : ""
      } ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} day${
        Math.floor(diffInSeconds / 86400) > 1 ? "s" : ""
      } ago`;
    return date.toLocaleDateString();
  };

  // Helper function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "#DC2626";
      case "high":
        return "#EA580C";
      case "medium":
        return "#D97706";
      case "low":
        return "#059669";
      default:
        return "#9A5000";
    }
  };

  // Filter notifications by type
  const categorizedNotifications = useMemo(() => {
    const formatted = notifications.map(formatNotification);
    return {
      all: formatted,
      newOrder: formatted.filter(
        (n: FormattedNotification) =>
          n.type === "order" && n.title.toLowerCase().includes("new")
      ),
      acceptedOrder: formatted.filter(
        (n: FormattedNotification) =>
          n.type === "order" && n.title.toLowerCase().includes("accepted")
      ),
      assignedOrder: formatted.filter(
        (n: FormattedNotification) =>
          n.type === "order" && n.title.toLowerCase().includes("assigned")
      ),
      completedOrder: formatted.filter(
        (n: FormattedNotification) =>
          n.type === "order" && n.title.toLowerCase().includes("completed")
      ),
      registration: formatted.filter(
        (n: FormattedNotification) =>
          n.type === "user" || n.title.toLowerCase().includes("registration")
      ),
    };
  }, [notifications]);

  return (
    <>
      <div className="bg-[#ffffff]  border-[#dbdce0] border-2 rounded-xl ">
        <div className="mt-4 mx-6">
          <div>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger
                  value="all"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500">
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="newOrder"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500">
                  New Order
                </TabsTrigger>
                <TabsTrigger
                  value="acceptedOrder"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500">
                  Accepted Order
                </TabsTrigger>
                <TabsTrigger
                  value="assignedOrder"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500">
                  Assigned Order
                </TabsTrigger>
                <TabsTrigger
                  value="completedOrder"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500">
                  Completed Order
                </TabsTrigger>
                <TabsTrigger
                  value="registration"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500">
                  Registration
                </TabsTrigger>
              </TabsList>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#DF8D28]" />
                  <span className="ml-2 text-gray-600">
                    Loading notifications...
                  </span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <p className="text-red-600 mb-2">
                      Failed to load notifications
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-[#DF8D28] hover:underline">
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {/* Tab Content */}
              {!isLoading && !error && (
                <>
                  <TabsContent value="all">
                    {categorizedNotifications.all.length > 0 ? (
                      categorizedNotifications.all.map(
                        (item: FormattedNotification) => (
                          <NotificationCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            time={item.time}
                            showCheckbox={item.showCheckbox}
                            showStatusDot={item.showStatusDot}
                            statusColor={item.statusColor}
                            onButtonClick={() =>
                              console.log(`Viewing ${item.title}`)
                            }
                          />
                        )
                      )
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No notifications found
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="newOrder">
                    {categorizedNotifications.newOrder.length > 0 ? (
                      categorizedNotifications.newOrder.map(
                        (item: FormattedNotification) => (
                          <NotificationCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            time={item.time}
                            showCheckbox={item.showCheckbox}
                            showStatusDot={item.showStatusDot}
                            statusColor={item.statusColor}
                            onButtonClick={() =>
                              console.log(`Viewing ${item.title}`)
                            }
                          />
                        )
                      )
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No new order notifications found
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="acceptedOrder">
                    {categorizedNotifications.acceptedOrder.length > 0 ? (
                      categorizedNotifications.acceptedOrder.map(
                        (item: FormattedNotification) => (
                          <NotificationCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            time={item.time}
                            showCheckbox={item.showCheckbox}
                            showStatusDot={item.showStatusDot}
                            statusColor={item.statusColor}
                            onButtonClick={() =>
                              console.log(`Viewing ${item.title}`)
                            }
                          />
                        )
                      )
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No accepted order notifications found
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="assignedOrder">
                    {categorizedNotifications.assignedOrder.length > 0 ? (
                      categorizedNotifications.assignedOrder.map(
                        (item: FormattedNotification) => (
                          <NotificationCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            time={item.time}
                            showCheckbox={item.showCheckbox}
                            showStatusDot={item.showStatusDot}
                            statusColor={item.statusColor}
                            onButtonClick={() =>
                              console.log(`Viewing ${item.title}`)
                            }
                          />
                        )
                      )
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No assigned order notifications found
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completedOrder">
                    {categorizedNotifications.completedOrder.length > 0 ? (
                      categorizedNotifications.completedOrder.map(
                        (item: FormattedNotification) => (
                          <NotificationCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            time={item.time}
                            showCheckbox={item.showCheckbox}
                            showStatusDot={item.showStatusDot}
                            statusColor={item.statusColor}
                            onButtonClick={() =>
                              console.log(`Viewing ${item.title}`)
                            }
                          />
                        )
                      )
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No completed order notifications found
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="registration">
                    {categorizedNotifications.registration.length > 0 ? (
                      categorizedNotifications.registration.map(
                        (item: FormattedNotification) => (
                          <NotificationCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            time={item.time}
                            showCheckbox={item.showCheckbox}
                            showStatusDot={item.showStatusDot}
                            statusColor={item.statusColor}
                            onButtonClick={() =>
                              console.log(`Viewing ${item.title}`)
                            }
                          />
                        )
                      )
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No registration notifications found
                      </div>
                    )}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
          <div className="border-b border-[#dedde2] w-full my-2"></div>

          <div className="my-2">
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationTable;

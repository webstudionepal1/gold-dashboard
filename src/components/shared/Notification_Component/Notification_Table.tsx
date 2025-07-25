import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tab";
import Pagination from "../_table/_Pagination";
import NotificationCard from "./NotificationCard";
import { useGetNotifications } from "../../../server/api/push-notifications";
import { useAuth } from "../../../hooks/useAuth";
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
}

const NotificationTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data: authData } = useAuth();
  const { data: notificationData, isLoading, error } = useGetNotifications();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  // Format notifications for display
  const formatNotifications = (
    notifications: any[]
  ): FormattedNotification[] => {
    if (!notifications) return [];

    return notifications.map((notification) => ({
      id: notification._id,
      title: notification.title,
      description:
        typeof notification.body === "string"
          ? notification.body
          : JSON.stringify(notification.body),
      time: new Date(notification.createdAt).toLocaleString(),
      showCheckbox: true,
      showStatusDot: true,
      statusColor: notification.isRead
        ? "bg-gray-400"
        : getStatusColor(notification.priority || "medium"),
      isRead: notification.isRead || false,
      type: notification.type || "general",
    }));
  };

  const getStatusColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-blue-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get all formatted notifications
  const allFormattedNotifications = useMemo(() => {
    return formatNotifications(notificationData?.data?.data || []);
  }, [notificationData]);

  // Filter notifications by type
  const getNotificationsByType = (type: string) => {
    if (type === "all") return allFormattedNotifications;
    return allFormattedNotifications.filter(
      (notification) => notification.type === type
    );
  };

  const totalItems = allFormattedNotifications.length;
  if (isLoading) {
    return (
      <div className="bg-[#ffffff] border-[#dbdce0] border-2 rounded-xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#DF8D28]" />
          <span className="ml-2 text-gray-600">Loading notifications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#ffffff] border-[#dbdce0] border-2 rounded-xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading notifications</p>
            <p className="text-gray-500 text-sm">
              Please try refreshing the page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#ffffff]  border-[#dbdce0] border-2 rounded-xl ">
        <div className="mt-4 mx-6">
          <div>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger
                  value="all"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                >
                  All ({allFormattedNotifications.length})
                </TabsTrigger>
                <TabsTrigger
                  value="order"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                >
                  Orders ({getNotificationsByType("order").length})
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                >
                  Payments ({getNotificationsByType("payment").length})
                </TabsTrigger>
                <TabsTrigger
                  value="alert"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                >
                  Alerts ({getNotificationsByType("alert").length})
                </TabsTrigger>
                <TabsTrigger
                  value="general"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                >
                  General ({getNotificationsByType("general").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {getNotificationsByType("all").length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No notifications found
                  </div>
                ) : (
                  getNotificationsByType("all").map((item) => (
                    <NotificationCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      time={item.time}
                      showCheckbox={item.showCheckbox}
                      showStatusDot={item.showStatusDot}
                      statusColor={item.statusColor}
                      onButtonClick={() => alert(`Viewing ${item.title}`)}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="order">
                {getNotificationsByType("order").length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No order notifications found
                  </div>
                ) : (
                  getNotificationsByType("order").map((item) => (
                    <NotificationCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      time={item.time}
                      showCheckbox={item.showCheckbox}
                      showStatusDot={item.showStatusDot}
                      statusColor={item.statusColor}
                      onButtonClick={() => alert(`Viewing ${item.title}`)}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="payment">
                {getNotificationsByType("payment").length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No payment notifications found
                  </div>
                ) : (
                  getNotificationsByType("payment").map((item) => (
                    <NotificationCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      time={item.time}
                      showCheckbox={item.showCheckbox}
                      showStatusDot={item.showStatusDot}
                      statusColor={item.statusColor}
                      onButtonClick={() => alert(`Viewing ${item.title}`)}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="alert">
                {getNotificationsByType("alert").length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No alert notifications found
                  </div>
                ) : (
                  getNotificationsByType("alert").map((item) => (
                    <NotificationCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      time={item.time}
                      showCheckbox={item.showCheckbox}
                      showStatusDot={item.showStatusDot}
                      statusColor={item.statusColor}
                      onButtonClick={() => alert(`Viewing ${item.title}`)}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="general">
                {getNotificationsByType("general").length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No general notifications found
                  </div>
                ) : (
                  getNotificationsByType("general").map((item) => (
                    <NotificationCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      time={item.time}
                      showCheckbox={item.showCheckbox}
                      showStatusDot={item.showStatusDot}
                      statusColor={item.statusColor}
                      onButtonClick={() => alert(`Viewing ${item.title}`)}
                    />
                  ))
                )}
              </TabsContent>
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

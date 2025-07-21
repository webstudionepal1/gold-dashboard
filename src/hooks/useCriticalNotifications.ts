import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../server/utils/ApiGateway";
import { toast } from "react-toastify";
import { CriticalNotification } from "../components/shared/CriticalNotificationBanner";

interface NotificationResponse {
  success: boolean;
  data: {
    data: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const useCriticalNotifications = () => {
  const [notifications, setNotifications] = useState<CriticalNotification[]>(
    []
  );
  const queryClient = useQueryClient();

  // Fetch notifications with optimized query
  const {
    data: notificationData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["critical-notifications"],
    queryFn: async (): Promise<NotificationResponse> => {
      const response = await apiClient.get("push-notification?limit=50&page=1");
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchIntervalInBackground: true,
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiClient.patch(
        `push-notification/${notificationId}`,
        {
          isRead: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["critical-notifications"] });
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to update notification");
    },
  });

  // Dismiss notification (mark as read and remove from UI)
  const dismissNotification = useCallback(
    (notificationId: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      markAsReadMutation.mutate(notificationId);
    },
    [markAsReadMutation]
  );

  // Mark as read without dismissing
  const markAsRead = useCallback(
    (notificationId: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      markAsReadMutation.mutate(notificationId);
    },
    [markAsReadMutation]
  );

  // Process and transform notification data using useMemo to prevent infinite loops
  const transformedNotifications = useMemo(() => {
    if (!notificationData?.data?.data) return [];

    return notificationData.data.data.map((item: any) => ({
      id: item._id,
      type: item.type,
      priority: item.priority || "medium",
      title: item.title,
      message:
        typeof item.body === "string" ? item.body : JSON.stringify(item.body),
      timestamp: item.createdAt,
      metadata: item.metadata,
      isRead: item.isRead || false,
    })) as CriticalNotification[];
  }, [notificationData]);

  // Update notifications state when transformed data changes
  useEffect(() => {
    setNotifications(transformedNotifications);
  }, [transformedNotifications]);

  // Calculate unread count using useMemo
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  // Filter critical notifications for banner display using useMemo
  const criticalNotifications = useMemo(
    () =>
      notifications.filter(
        (n) => !n.isRead && (n.priority === "critical" || n.priority === "high")
      ),
    [notifications]
  );

  // Get notifications by priority
  const getNotificationsByPriority = useCallback(
    (priority: string) => {
      return notifications.filter((n) => n.priority === priority);
    },
    [notifications]
  );

  // Get recent notifications (last 24 hours)
  const getRecentNotifications = useCallback(
    (hours: number = 24) => {
      const cutoff = new Date();
      cutoff.setHours(cutoff.getHours() - hours);

      return notifications.filter((n) => new Date(n.timestamp) > cutoff);
    },
    [notifications]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);

    if (unreadNotifications.length === 0) {
      toast.info("No unread notifications to mark");
      return;
    }

    try {
      // Update UI immediately for better UX
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      // Update backend
      await Promise.all(
        unreadNotifications.map((n) => markAsReadMutation.mutateAsync(n.id))
      );

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to update notifications");

      // Revert UI changes on error by refetching data
      queryClient.invalidateQueries({ queryKey: ["critical-notifications"] });
    }
  }, [notifications, markAsReadMutation, queryClient]);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Get notification statistics using useMemo for performance
  const getNotificationStats = useCallback(() => {
    const stats = {
      total: notifications.length,
      unread: unreadCount,
      critical: notifications.filter((n) => n.priority === "critical").length,
      high: notifications.filter((n) => n.priority === "high").length,
      medium: notifications.filter((n) => n.priority === "medium").length,
      low: notifications.filter((n) => n.priority === "low").length,
      recent: getRecentNotifications().length,
    };

    return stats;
  }, [notifications, unreadCount, getRecentNotifications]);

  // Subscribe to real-time notifications (if using Socket.IO)
  useEffect(() => {
    // This would be implemented if you have Socket.IO set up
    // const socket = io();
    // socket.on('critical-notification', (notification) => {
    //   setNotifications(prev => [notification, ...prev]);
    //   setUnreadCount(prev => prev + 1);
    //
    //   // Show toast for critical notifications
    //   if (notification.priority === 'critical') {
    //     toast.error(notification.title, {
    //       description: notification.message,
    //       duration: 10000
    //     });
    //   }
    // });
    //
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return {
    // Data
    notifications,
    criticalNotifications,
    unreadCount,
    isLoading,
    error,

    // Actions
    dismissNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,

    // Utilities
    getNotificationsByPriority,
    getRecentNotifications,
    getNotificationStats,

    // Mutation states
    isMarkingAsRead: markAsReadMutation.isPending,
  };
};

export default useCriticalNotifications;

import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "../server/utils/ApiGateway";
import { useAuth } from "./useAuth";

export interface CriticalNotification {
  id: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  message: string;
  timestamp: string;
  metadata?: {
    amount?: number;
    orderId?: string;
    userId?: string;
    [key: string]: any;
  };
  isRead: boolean;
}

interface NotificationResponse {
  data: {
    data: any[];
    total: number;
    page: number;
    limit: number;
  };
}

interface NotificationStats {
  total: number;
  unread: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface UseCriticalNotificationsReturn {
  notifications: CriticalNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: any;
  refetch: () => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (notificationId: string) => void;
  getNotificationsByPriority: (
    priority: CriticalNotification["priority"]
  ) => CriticalNotification[];
  getNotificationStats: () => NotificationStats;
  criticalNotifications: CriticalNotification[];
}

export const useCriticalNotifications = (): UseCriticalNotificationsReturn => {
  const [notifications, setNotifications] = useState<CriticalNotification[]>(
    []
  );
  const queryClient = useQueryClient();
  const { data: authData } = useAuth();

  // Fetch notifications with optimized query
  const {
    data: notificationData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["critical-notifications", authData?.user],
    queryFn: async (): Promise<NotificationResponse> => {
      if (!authData?.user) {
        throw new Error("User not authenticated");
      }

      const userData = JSON.parse(authData.user);
      const response = await apiClient.get(
        `push-notification?user=${userData._id}&limit=50&page=1`
      );
      return response.data;
    },
    enabled: !!authData?.user,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchIntervalInBackground: true,
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Mutation for marking notifications as read
  const markAsReadMutation = useMutation({
    mutationFn: async ({
      notificationId,
      updates,
    }: {
      notificationId: string;
      updates: any;
    }) => {
      const response = await apiClient.patch(
        `push-notification/${notificationId}`,
        updates
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["critical-notifications"] });
    },
    onError: (error) => {
      console.error("Failed to update notification:", error);
      toast.error("Failed to update notification");
    },
  });

  // Mutation for bulk operations
  const bulkUpdateMutation = useMutation({
    mutationFn: async (updates: { ids: string[]; data: any }) => {
      const response = await apiClient.patch("push-notification/bulk", updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["critical-notifications"] });
    },
    onError: (error) => {
      console.error("Failed to bulk update notifications:", error);
      toast.error("Failed to update notifications");
    },
  });

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

  // Calculate unread count
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  // Get critical notifications
  const criticalNotifications = useMemo(
    () => notifications.filter((n) => n.priority === "critical"),
    [notifications]
  );

  // Mark single notification as read
  const markAsRead = useCallback(
    (notificationId: string) => {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Update backend
      const notification = notifications.find((n) => n.id === notificationId);
      if (notification) {
        markAsReadMutation.mutate({
          notificationId,
          updates: { ...notification, isRead: true },
        });
      }
    },
    [notifications, markAsReadMutation]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);

    if (unreadNotifications.length === 0) {
      return;
    }

    // Optimistic update
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );

    // Update backend
    bulkUpdateMutation.mutate({
      ids: unreadNotifications.map((n) => n.id),
      data: { isRead: true },
    });
  }, [notifications, bulkUpdateMutation]);

  // Dismiss notification (remove from list)
  const dismissNotification = useCallback((notificationId: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );

    // You might want to add a backend call here to actually delete the notification
    // For now, we'll just remove it from the local state
  }, []);

  // Get notifications by priority
  const getNotificationsByPriority = useCallback(
    (priority: CriticalNotification["priority"]) => {
      return notifications.filter((n) => n.priority === priority);
    },
    [notifications]
  );

  // Get notification statistics
  const getNotificationStats = useCallback((): NotificationStats => {
    const stats = notifications.reduce(
      (acc, notification) => {
        acc.total++;
        if (!notification.isRead) acc.unread++;
        acc[notification.priority]++;
        return acc;
      },
      {
        total: 0,
        unread: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      }
    );

    return stats;
  }, [notifications]);

  // Handle real-time updates (if using WebSocket or Server-Sent Events)
  useEffect(() => {
    // This would be implemented if you have real-time notifications set up
    // Example with Socket.IO:
    // const socket = io();
    // socket.on('critical-notification', (notification) => {
    //   setNotifications(prev => [notification, ...prev]);
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

  // Auto-refetch on window focus
  useEffect(() => {
    const handleFocus = () => {
      if (!isLoading) {
        refetch();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isLoading, refetch]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    getNotificationsByPriority,
    getNotificationStats,
    criticalNotifications,
  };
};

export default useCriticalNotifications;

import React, { useState, useEffect } from "react";
import { X, AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useCriticalNotifications from "../../hooks/useCriticalNotifications";

export interface CriticalNotification {
  id: string;
  type: string;
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  timestamp: string;
  metadata?: any;
  isRead?: boolean;
}

interface CriticalNotificationBannerProps {
  maxVisible?: number;
}

const CriticalNotificationBanner: React.FC<CriticalNotificationBannerProps> = ({
  maxVisible = 3,
}) => {
  const {
    criticalNotifications: notifications = [],
    markAsRead,
    dismissNotification,
  } = useCriticalNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState<
    CriticalNotification[]
  >([]);

  useEffect(() => {
    // Sort by priority and timestamp, show only unread critical/high priority notifications
    if (!notifications || !Array.isArray(notifications)) {
      setVisibleNotifications([]);
      return;
    }

    const sortedNotifications = notifications
      .filter(
        (n) => !n.isRead && (n.priority === "critical" || n.priority === "high")
      )
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      })
      .slice(0, maxVisible);

    setVisibleNotifications(sortedNotifications);
  }, [notifications, maxVisible]);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "critical":
        return {
          bgColor: "bg-red-600",
          textColor: "text-white",
          icon: AlertTriangle,
          borderColor: "border-red-700",
        };
      case "high":
        return {
          bgColor: "bg-orange-500",
          textColor: "text-white",
          icon: AlertCircle,
          borderColor: "border-orange-600",
        };
      case "medium":
        return {
          bgColor: "bg-yellow-500",
          textColor: "text-white",
          icon: Info,
          borderColor: "border-yellow-600",
        };
      default:
        return {
          bgColor: "bg-blue-500",
          textColor: "text-white",
          icon: CheckCircle,
          borderColor: "border-blue-600",
        };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleDismiss = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dismissNotification(id);
  };

  const handleClick = (notification: CriticalNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {visibleNotifications.map((notification) => {
          const config = getPriorityConfig(notification.priority);
          const Icon = config.icon;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`${config.bgColor} ${config.textColor} rounded-lg shadow-lg border-l-4 ${config.borderColor} cursor-pointer hover:shadow-xl transition-shadow duration-200`}
              onClick={() => handleClick(notification)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm truncate">
                          {notification.title}
                        </h4>
                        <span className="text-xs opacity-75 ml-2 flex-shrink-0">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm opacity-90 leading-relaxed">
                        {notification.message}
                      </p>

                      {/* Priority badge */}
                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            notification.priority === "critical"
                              ? "bg-red-800 text-red-100"
                              : "bg-black bg-opacity-20 text-white"
                          }`}
                        >
                          {notification.priority.toUpperCase()}
                        </span>

                        {/* Additional metadata */}
                        {notification.metadata?.amount && (
                          <span className="text-xs opacity-75">
                            Rs. {notification.metadata.amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDismiss(notification.id, e)}
                    className="ml-2 p-1 hover:bg-black hover:bg-opacity-20 rounded-full transition-colors duration-150 flex-shrink-0"
                    aria-label="Dismiss notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Animated progress bar for auto-dismiss */}
              {notification.priority === "critical" && (
                <motion.div
                  className="h-1 bg-white bg-opacity-30 rounded-b-lg"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 10, ease: "linear" }}
                  onAnimationComplete={() =>
                    dismissNotification(notification.id)
                  }
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Show count if there are more notifications */}
      {notifications.filter(
        (n) => !n.isRead && (n.priority === "critical" || n.priority === "high")
      ).length > maxVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-600 text-white">
            +
            {notifications.filter(
              (n) =>
                !n.isRead &&
                (n.priority === "critical" || n.priority === "high")
            ).length - maxVisible}{" "}
            more
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default CriticalNotificationBanner;

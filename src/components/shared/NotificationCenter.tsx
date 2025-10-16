import React, { useState } from "react";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Filter,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useCriticalNotifications from "../../hooks/useCriticalNotifications";
import { CriticalNotification } from "./CriticalNotificationBanner";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    unreadCount,
    dismissNotification,
    markAsRead,
    markAllAsRead,
    getNotificationsByPriority,
    getNotificationStats,
  } = useCriticalNotifications();

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  const stats = getNotificationStats();

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "high":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "medium":
        return <Info className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-l-red-500 bg-red-50";
      case "high":
        return "border-l-orange-500 bg-orange-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-blue-500 bg-blue-50";
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

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedFilter === "unread" && notification.isRead) return false;
    if (selectedFilter === "read" && !notification.isRead) return false;
    if (
      selectedPriority !== "all" &&
      notification.priority !== selectedPriority
    )
      return false;
    return true;
  });

  const handleNotificationClick = (notification: CriticalNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Stats */}
          <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-red-600">{stats.critical}</div>
              <div className="text-gray-500">Critical</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-orange-600">{stats.high}</div>
              <div className="text-gray-500">High</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">
                {stats.medium}
              </div>
              <div className="text-gray-500">Medium</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">{stats.low}</div>
              <div className="text-gray-500">Low</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedFilter === "all"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter("unread")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedFilter === "unread"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setSelectedFilter("read")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedFilter === "read"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Read
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`border-l-4 p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${getPriorityColor(
                    notification.priority
                  )} ${!notification.isRead ? "bg-blue-50" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getPriorityIcon(notification.priority)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4
                            className={`text-sm font-medium ${
                              !notification.isRead
                                ? "text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 ml-2">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {notification.message}
                        </p>

                        {notification.metadata?.amount && (
                          <div className="mt-2 text-xs text-gray-500">
                            Amount: Rs.{" "}
                            {notification.metadata.amount.toLocaleString()}
                          </div>
                        )}

                        <div className="mt-2 flex items-center justify-between">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              notification.priority === "critical"
                                ? "bg-red-100 text-red-800"
                                : notification.priority === "high"
                                ? "bg-orange-100 text-orange-800"
                                : notification.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {notification.priority.toUpperCase()}
                          </span>

                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                      }}
                      className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationCenter;

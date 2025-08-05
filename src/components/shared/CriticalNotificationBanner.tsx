import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

interface CriticalNotificationBannerProps {
  notifications: CriticalNotification[];
  onDismiss: (notificationId: string) => void;
  onMarkAsRead: (notificationId: string) => void;
  autoHideDelay?: number;
}

const CriticalNotificationBanner: React.FC<CriticalNotificationBannerProps> = ({
  notifications,
  onDismiss,
  onMarkAsRead,
  autoHideDelay = 10000, // 10 seconds default
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([]);
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set());

  // Filter for critical unread notifications that haven't been dismissed
  const criticalNotifications = notifications.filter(
    (notification) =>
      notification.priority === 'critical' &&
      !notification.isRead &&
      !dismissedNotifications.has(notification.id)
  );

  // Update visible notifications when critical notifications change
  useEffect(() => {
    const newNotifications = criticalNotifications
      .filter((notification) => !visibleNotifications.includes(notification.id))
      .map((notification) => notification.id);

    if (newNotifications.length > 0) {
      setVisibleNotifications((prev) => [...prev, ...newNotifications]);
    }
  }, [criticalNotifications, visibleNotifications]);

  // Auto-hide notifications after delay
  useEffect(() => {
    if (autoHideDelay > 0) {
      const timers = visibleNotifications.map((notificationId) => {
        return setTimeout(() => {
          handleDismiss(notificationId);
        }, autoHideDelay);
      });

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [visibleNotifications, autoHideDelay]);

  const handleDismiss = (notificationId: string) => {
    setVisibleNotifications((prev) => prev.filter((id) => id !== notificationId));
    setDismissedNotifications((prev) => new Set([...prev, notificationId]));
    onDismiss(notificationId);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setVisibleNotifications((prev) => prev.filter((id) => id !== notificationId));
    onMarkAsRead(notificationId);
  };

  const visibleCriticalNotifications = criticalNotifications.filter((notification) =>
    visibleNotifications.includes(notification.id)
  );

  if (visibleCriticalNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {visibleCriticalNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                delay: index * 0.1,
              }}
              className="pointer-events-auto mb-2"
              style={{ marginTop: index * 60 + 20 }} // Stack banners with offset
            >
              <div className="bg-red-600 border border-red-700 rounded-lg shadow-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, -5, 5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </motion.div>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-white">
                        Critical Alert: {notification.title}
                      </h3>
                      <div className="mt-1 text-sm text-red-100">
                        <p>{notification.message}</p>
                        {notification.metadata?.amount && (
                          <p className="mt-1 font-semibold">
                            Amount: ₹{notification.metadata.amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="mt-3 flex space-x-3">
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Mark as Read
                        </button>
                        <button
                          onClick={() => handleDismiss(notification.id)}
                          className="inline-flex items-center px-3 py-1 border border-red-300 text-xs font-medium rounded-md text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleDismiss(notification.id)}
                        className="inline-flex text-red-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md p-1"
                      >
                        <span className="sr-only">Dismiss</span>
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar for auto-hide */}
                {autoHideDelay > 0 && (
                  <motion.div
                    className="h-1 bg-red-800"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: autoHideDelay / 1000, ease: 'linear' }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CriticalNotificationBanner;

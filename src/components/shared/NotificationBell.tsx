import React, { useState } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';
import useCriticalNotifications from '../../hooks/useCriticalNotifications';
import NotificationCenter from './NotificationCenter';
import CriticalNotificationBanner from './CriticalNotificationBanner';

const NotificationBell: React.FC = () => {
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const {
    criticalNotifications,
    unreadCount,
    dismissNotification,
    markAsRead,
    getNotificationStats
  } = useCriticalNotifications();

  const stats = getNotificationStats();
  const hasCriticalNotifications = stats.critical > 0;
  const hasHighPriorityNotifications = stats.high > 0;

  const bellVariants = {
    idle: { rotate: 0 },
    ring: { 
      rotate: [0, -10, 10, -10, 10, 0],
      transition: { 
        duration: 0.6,
        repeat: hasCriticalNotifications ? Infinity : 0,
        repeatDelay: 2
      }
    }
  };

  const pulseVariants = {
    idle: { scale: 1, opacity: 0.7 },
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: hasCriticalNotifications ? Infinity : 0,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      {/* Critical Notification Banner */}
      <CriticalNotificationBanner
        notifications={criticalNotifications}
        onDismiss={dismissNotification}
        onMarkAsRead={markAsRead}
        maxVisible={3}
      />

      {/* Notification Bell */}
      <div className="relative">
        <motion.button
          onClick={() => setIsNotificationCenterOpen(true)}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulsing background for critical notifications */}
          {hasCriticalNotifications && (
            <motion.div
              className="absolute inset-0 bg-red-500 rounded-full"
              variants={pulseVariants}
              animate="pulse"
              initial="idle"
            />
          )}

          {/* Bell icon with animation */}
          <motion.div
            variants={bellVariants}
            animate={hasCriticalNotifications ? "ring" : "idle"}
            initial="idle"
          >
            {hasCriticalNotifications || hasHighPriorityNotifications ? (
              <BellRing className="w-6 h-6 relative z-10" />
            ) : (
              <Bell className="w-6 h-6 relative z-10" />
            )}
          </motion.div>

          {/* Notification count badge */}
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className={`absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 rounded-full min-w-[1.25rem] h-5 ${
                hasCriticalNotifications
                  ? 'bg-red-600 animate-pulse'
                  : hasHighPriorityNotifications
                  ? 'bg-orange-500'
                  : 'bg-blue-500'
              }`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}

          {/* Critical notification indicator */}
          {hasCriticalNotifications && (
            <motion.div
              className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full border-2 border-white"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.button>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {unreadCount === 0 
            ? 'No new notifications' 
            : `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
          }
          {hasCriticalNotifications && (
            <span className="block text-red-300 font-semibold">
              {stats.critical} critical alert{stats.critical === 1 ? '' : 's'}!
            </span>
          )}
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </>
  );
};

export default NotificationBell;

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  getMessagingInstance,
  requestFCMToken,
  registerServiceWorker,
  checkNotificationPermission,
} from "../utils/firebaseConfig";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../server/utils/ApiGateway";
import { notificationPersistence } from "../utils/notificationPersistence";

export interface NotificationMessage {
  id: string;
  title: string;
  body: string;
  type: string;
  timestamp: Date;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "critical";
  data?: Record<string, any>;
}

interface NotificationContextType {
  // State
  isInitialized: boolean;
  fcmToken: string | null;
  notifications: NotificationMessage[];
  unreadCount: number;
  permissionStatus: NotificationPermission | null;

  // Actions
  initializeNotifications: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  registerFCMToken: () => Promise<string | null>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  retryInitialization: () => void;

  // Status
  isSupported: boolean;
  isLoading: boolean;
  error: string | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add ref to prevent multiple initialization attempts
  const initializationAttempted = useRef(false);
  const initializationInProgress = useRef(false);
  const lastFailureTime = useRef<number>(0);
  const RETRY_COOLDOWN = 30000; // 30 seconds cooldown between retries

  const { data: authData } = useAuth();
  const queryClient = useQueryClient();

  // Define functions with useCallback to prevent re-renders
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const hasPermission = await checkNotificationPermission();
      setPermissionStatus(Notification.permission);
      return hasPermission;
    } catch (err) {
      console.error("Permission request failed:", err);
      return false;
    }
  }, []);

  const sendTokenToBackend = useCallback(
    async (token: string) => {
      try {
        let userData;
        if (typeof authData?.user === "string") {
          if (authData.user === "[object Object]") {
            console.error("Invalid user data format in NotificationContext");
            return;
          }
          userData = JSON.parse(authData.user);
        } else {
          userData = authData?.user;
        }

        if (userData?._id) {
          await apiClient.patch(`user/${userData._id}`, {
            FCMToken: token,
          });
          console.log("FCM token sent to backend successfully");
        }
      } catch (err) {
        console.error("Failed to send FCM token to backend:", err);
      }
    },
    [authData]
  );

  const registerFCMToken = useCallback(async (): Promise<string | null> => {
    try {
      console.log("Starting FCM token registration...");
      const token = await requestFCMToken();
      if (token) {
        setFcmToken(token);
        console.log("FCM token registered successfully");

        // Send token to backend
        if (authData?.user) {
          await sendTokenToBackend(token);
        }

        return token;
      } else {
        console.warn(
          "FCM token registration returned null - notifications may not work"
        );
        return null;
      }
    } catch (err) {
      console.error("FCM token registration failed:", err);
      // Don't throw error, just return null to allow app to continue
      return null;
    }
  }, [authData, sendTokenToBackend]);

  const setupMessageListener = useCallback(async () => {
    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) {
      throw new Error("Messaging instance not available");
    }

    // Listen for foreground messages
    onMessage(messagingInstance, (payload) => {
      console.log("Received foreground message:", payload);

      const notification: NotificationMessage = {
        id: Date.now().toString(),
        title: payload.notification?.title || "New Notification",
        body: payload.notification?.body || "",
        type: payload.data?.type || "general",
        timestamp: new Date(),
        isRead: false,
        priority: (payload.data?.priority as any) || "medium",
        data: payload.data,
      };

      // Add to notifications list and persist
      setNotifications((prev) => {
        const updated = [notification, ...prev];
        notificationPersistence.saveNotification(notification);
        return updated;
      });

      // Show toast notification
      toast.info(notification.title, {
        onClick: () => {
          // Mark as read inline to avoid circular dependency
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, isRead: true } : n
            )
          );
          notificationPersistence.updateNotification(notification.id, {
            isRead: true,
          });
        },
      });

      // Invalidate queries to refresh notification lists
      queryClient.invalidateQueries({ queryKey: ["critical-notifications"] });
    });
  }, [queryClient]);

  const initializeNotifications = useCallback(async () => {
    const now = Date.now();

    // Prevent multiple initialization attempts and implement cooldown
    if (
      isLoading ||
      isInitialized ||
      initializationInProgress.current ||
      (initializationAttempted.current &&
        now - lastFailureTime.current < RETRY_COOLDOWN)
    ) {
      return;
    }

    initializationAttempted.current = true;
    initializationInProgress.current = true;
    setIsLoading(true);
    setError(null);

    try {
      console.log("Initializing notifications...");

      // Register service worker
      const swRegistered = await registerServiceWorker();
      if (!swRegistered) {
        throw new Error("Service worker registration failed");
      }

      // Request permission
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error("Notification permission denied");
      }

      // Get FCM token (allow to fail gracefully)
      const token = await registerFCMToken();
      if (!token) {
        console.warn(
          "FCM token registration failed, but continuing with initialization"
        );
        // Don't throw error here - allow app to continue without FCM
      }

      // Set up message listener (only if we have a token)
      if (token) {
        try {
          await setupMessageListener();
          console.log("Message listener set up successfully");
        } catch (listenerErr) {
          console.warn("Failed to set up message listener:", listenerErr);
          // Continue without message listener
        }
      }

      setIsInitialized(true);
      console.log("Notifications initialized successfully");

      // Reset failure tracking on success
      lastFailureTime.current = 0;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Notification initialization failed:", errorMessage);
      setError(errorMessage);

      // Record failure time for cooldown
      lastFailureTime.current = now;

      // Only show toast error for critical failures (not FCM token issues)
      if (
        !errorMessage.includes("FCM token") &&
        !errorMessage.includes("push service") &&
        !errorMessage.includes("AbortError")
      ) {
        toast.error(
          "Failed to initialize notifications. Please check your browser settings."
        );
      } else {
        // For FCM-related errors, just log them
        console.info(
          "Notifications partially initialized - FCM features may not work"
        );
      }

      // Don't reset attempt flag - let cooldown handle retries
    } finally {
      setIsLoading(false);
      initializationInProgress.current = false;
    }
  }, [
    isLoading,
    isInitialized,
    requestPermission,
    registerFCMToken,
    setupMessageListener,
  ]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    notificationPersistence.updateNotification(notificationId, {
      isRead: true,
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
    notificationPersistence.markAllAsRead();
  }, []);

  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
    notificationPersistence.removeNotification(notificationId);
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    notificationPersistence.clearAllNotifications();
  }, []);

  // Manual retry function for failed initialization
  const retryInitialization = useCallback(() => {
    initializationAttempted.current = false;
    initializationInProgress.current = false;
    lastFailureTime.current = 0; // Reset cooldown
    setError(null);
    initializeNotifications();
  }, [initializeNotifications]);

  // Check if notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const messagingInstance = await getMessagingInstance();
        setIsSupported(!!messagingInstance);

        if ("Notification" in window) {
          setPermissionStatus(Notification.permission);
        }
      } catch (err) {
        console.error("Notification support check failed:", err);
        setIsSupported(false);
      }
    };

    checkSupport();
  }, []);

  // Load persisted notifications on mount
  useEffect(() => {
    if (isSupported) {
      const persistedNotifications = notificationPersistence.getNotifications();
      setNotifications(persistedNotifications);
    }
  }, [isSupported]);

  // Initialize notifications when user is authenticated (only once)
  useEffect(() => {
    if (
      authData &&
      isSupported &&
      !isInitialized &&
      !isLoading &&
      !initializationAttempted.current &&
      !initializationInProgress.current
    ) {
      initializeNotifications();
    }
  }, [
    authData,
    isSupported,
    isInitialized,
    isLoading,
    initializeNotifications,
  ]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const contextValue: NotificationContextType = useMemo(
    () => ({
      // State
      isInitialized,
      fcmToken,
      notifications,
      unreadCount,
      permissionStatus,

      // Actions
      initializeNotifications,
      requestPermission,
      registerFCMToken,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      clearAllNotifications,
      retryInitialization,

      // Status
      isSupported,
      isLoading,
      error,
    }),
    [
      isInitialized,
      fcmToken,
      notifications,
      unreadCount,
      permissionStatus,
      initializeNotifications,
      requestPermission,
      registerFCMToken,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      clearAllNotifications,
      retryInitialization,
      isSupported,
      isLoading,
      error,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export default NotificationProvider;

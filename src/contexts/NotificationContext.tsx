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

export interface NotificationMessage {
  id: string;
  title: string;
  body: string;
  type: string;
  timestamp: Date;
  isRead: boolean;
  priority: "critical" | "high" | "medium" | "low";
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

  const queryClient = useQueryClient();
  const { data: authData } = useAuth();
  const initializationInProgress = useRef(false);
  const lastInitializationAttempt = useRef(0);
  const INITIALIZATION_COOLDOWN = 30000; // 30 seconds

  // Calculate unread count
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  // Send FCM token to backend
  const sendTokenToBackend = useCallback(
    async (token: string) => {
      try {
        if (!authData?.user) {
          console.warn(
            "No authenticated user found, skipping token registration"
          );
          return;
        }

        const userData = JSON.parse(authData.user);
        await apiClient.post("push-notification/register-token", {
          token,
          userId: userData._id,
        });
        console.log("FCM token sent to backend successfully");
      } catch (error) {
        console.error("Failed to send FCM token to backend:", error);
        // Don't throw error - allow app to continue
      }
    },
    [authData]
  );

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const hasPermission = await checkNotificationPermission();
      setPermissionStatus(Notification.permission);
      return hasPermission;
    } catch (error) {
      console.error("Permission request failed:", error);
      setPermissionStatus("denied");
      return false;
    }
  }, []);

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

  // Setup message listener
  const setupMessageListener = useCallback(async () => {
    try {
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

        // Add to notifications list
        setNotifications((prev) => [notification, ...prev]);

        // Show toast notification
        const toastOptions = {
          position: "top-right" as const,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        };

        switch (notification.priority) {
          case "critical":
            toast.error(notification.title, toastOptions);
            break;
          case "high":
            toast.warning(notification.title, toastOptions);
            break;
          case "medium":
            toast.info(notification.title, toastOptions);
            break;
          case "low":
            toast.success(notification.title, toastOptions);
            break;
          default:
            toast(notification.title, toastOptions);
        }

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["push-notification"] });
      });

      console.log("Message listener setup successfully");
    } catch (error) {
      console.error("Failed to setup message listener:", error);
      throw error;
    }
  }, [queryClient]);

  // Initialize notifications
  const initializeNotifications = useCallback(async () => {
    // Prevent multiple simultaneous initialization attempts
    if (initializationInProgress.current || isLoading) {
      console.log("Initialization already in progress, skipping...");
      return;
    }

    // Check cooldown period
    const now = Date.now();
    if (now - lastInitializationAttempt.current < INITIALIZATION_COOLDOWN) {
      console.log("Initialization cooldown active, skipping...");
      return;
    }

    if (isInitialized) {
      console.log("Notifications already initialized");
      return;
    }

    initializationInProgress.current = true;
    lastInitializationAttempt.current = now;
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

      // Setup message listener
      await setupMessageListener();

      setIsInitialized(true);
      console.log("Notifications initialized successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Notification initialization failed:", errorMessage);
      setError(errorMessage);

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

  // Retry initialization
  const retryInitialization = useCallback(() => {
    console.log("Retrying notification initialization...");
    setIsInitialized(false);
    setError(null);
    lastInitializationAttempt.current = 0; // Reset cooldown
    initializeNotifications();
  }, [initializeNotifications]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

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

  // Auto-initialize when user is authenticated and notifications are supported
  useEffect(() => {
    if (isSupported && authData?.user && !isInitialized && !isLoading) {
      console.log("Auto-initializing notifications for authenticated user");
      initializeNotifications();
    }
  }, [
    isSupported,
    authData,
    isInitialized,
    isLoading,
    initializeNotifications,
  ]);

  // Context value
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

export default NotificationContext;

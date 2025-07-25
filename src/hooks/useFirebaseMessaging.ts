import { useEffect, useCallback, useState } from "react";
import { onMessage, MessagePayload } from "firebase/messaging";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { getMessagingInstance } from "../utils/firebaseConfig";
import { playNotificationSound } from "../utils/notificationSounds";
import { notificationPersistence } from "../utils/notificationPersistence";

interface FirebaseMessage {
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
  };
  data?: Record<string, string>;
}

interface UseFirebaseMessagingReturn {
  isListening: boolean;
  lastMessage: FirebaseMessage | null;
  messageCount: number;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
}

export const useFirebaseMessaging = (): UseFirebaseMessagingReturn => {
  const [isListening, setIsListening] = useState(false);
  const [lastMessage, setLastMessage] = useState<FirebaseMessage | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Process incoming message
  const processMessage = useCallback(
    (payload: MessagePayload) => {
      console.log("Processing foreground message:", payload);

      const message: FirebaseMessage = {
        notification: payload.notification,
        data: payload.data,
      };

      setLastMessage(message);
      setMessageCount((prev) => prev + 1);

      // Extract notification details
      const title = payload.notification?.title || "New Notification";
      const body = payload.notification?.body || "";
      const priority = (payload.data?.priority as any) || "medium";
      const type = payload.data?.type || "general";

      // Create notification object for persistence
      const notificationData = {
        id: Date.now().toString(),
        title,
        body,
        type,
        timestamp: new Date(),
        isRead: false,
        priority: priority as "critical" | "high" | "medium" | "low",
        data: payload.data,
      };

      // Persist notification
      try {
        notificationPersistence.saveNotification(notificationData);
      } catch (error) {
        console.warn("Failed to persist notification:", error);
      }

      // Play notification sound
      try {
        playNotificationSound(
          priority,
          type === "success" ||
            type === "error" ||
            type === "warning" ||
            type === "info"
            ? type
            : undefined
        );
      } catch (error) {
        console.warn("Failed to play notification sound:", error);
      }

      // Show toast notification with priority-based styling
      const toastOptions = {
        position: "top-right" as const,
        autoClose: getAutoCloseTime(priority),
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: getToastClassName(priority),
      };

      switch (priority) {
        case "critical":
          toast.error(title, {
            ...toastOptions,
            autoClose: 10000, // Keep critical notifications longer
          });
          break;
        case "high":
          toast.warning(title, toastOptions);
          break;
        case "medium":
          toast.info(title, toastOptions);
          break;
        case "low":
          toast.success(title, toastOptions);
          break;
        default:
          toast(title, toastOptions);
      }

      // Show browser notification as fallback
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(title, {
            body,
            icon: payload.notification?.icon || "/logo.svg",
            tag: notificationData.id,
            requireInteraction: priority === "critical",
          });
        } catch (error) {
          console.warn("Failed to show browser notification:", error);
        }
      }

      // Invalidate queries to refresh notification data
      queryClient.invalidateQueries({ queryKey: ["push-notification"] });
      queryClient.invalidateQueries({ queryKey: ["critical-notifications"] });
    },
    [queryClient]
  );

  // Get auto-close time based on priority
  const getAutoCloseTime = (priority: string): number => {
    switch (priority) {
      case "critical":
        return 10000; // 10 seconds
      case "high":
        return 7000; // 7 seconds
      case "medium":
        return 5000; // 5 seconds
      case "low":
        return 3000; // 3 seconds
      default:
        return 5000;
    }
  };

  // Get toast className based on priority
  const getToastClassName = (priority: string): string => {
    const baseClass = "notification-toast";
    switch (priority) {
      case "critical":
        return `${baseClass} critical-notification`;
      case "high":
        return `${baseClass} high-notification`;
      case "medium":
        return `${baseClass} medium-notification`;
      case "low":
        return `${baseClass} low-notification`;
      default:
        return baseClass;
    }
  };

  // Start listening for messages
  const startListening = useCallback(async (): Promise<void> => {
    if (isListening) {
      console.log("Already listening for messages");
      return;
    }

    try {
      setError(null);
      console.log("Starting Firebase message listener...");

      const messagingInstance = await getMessagingInstance();
      if (!messagingInstance) {
        throw new Error("Firebase messaging not available");
      }

      // Set up message listener
      onMessage(messagingInstance, processMessage);

      setIsListening(true);
      console.log("Firebase message listener started successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Failed to start message listener:", errorMessage);
      setError(errorMessage);
      setIsListening(false);
      throw err;
    }
  }, [isListening, processMessage]);

  // Stop listening for messages
  const stopListening = useCallback(() => {
    if (!isListening) {
      console.log("Not currently listening for messages");
      return;
    }

    console.log("Stopping Firebase message listener...");
    setIsListening(false);
    setError(null);
  }, [isListening]);

  // Auto-start listening when component mounts
  useEffect(() => {
    const initializeListener = async () => {
      try {
        await startListening();
      } catch (error) {
        console.error("Failed to initialize message listener:", error);
      }
    };

    initializeListener();

    // Cleanup on unmount
    return () => {
      stopListening();
    };
  }, [startListening, stopListening]);

  return {
    isListening,
    lastMessage,
    messageCount,
    error,
    startListening,
    stopListening,
  };
};

export default useFirebaseMessaging;

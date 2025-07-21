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
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  const queryClient = useQueryClient();

  const handleMessage = useCallback(
    async (payload: MessagePayload) => {
      console.log("Received foreground message:", payload);

      const message: FirebaseMessage = {
        notification: payload.notification,
        data: payload.data,
      };

      setLastMessage(message);
      setMessageCount((prev) => prev + 1);

      // Create notification object
      const notificationTitle =
        payload.notification?.title || "New Notification";
      const notificationBody = payload.notification?.body || "";
      const notificationType = payload.data?.type || "general";
      const priority = payload.data?.priority || "medium";
      const notificationId = payload.data?.id || Date.now().toString();

      // Create notification for persistence
      const notification = {
        id: notificationId,
        title: notificationTitle,
        body: notificationBody,
        type: notificationType,
        timestamp: new Date(),
        isRead: false,
        priority: priority as "low" | "medium" | "high" | "critical",
        data: payload.data,
      };

      // Save to persistence
      notificationPersistence.saveNotification(notification);

      // Show toast notification with appropriate styling based on priority
      const toastOptions = {
        onClick: () => {
          // Mark as read when clicked
          notificationPersistence.markAsRead(notificationId);
        },
        autoClose: priority === "critical" ? (false as const) : 5000,
        closeOnClick: true,
        hideProgressBar: priority === "critical",
        className:
          priority === "critical" ? "critical-notification" : undefined,
      };

      // Show different toast types based on priority
      switch (priority) {
        case "critical":
          toast.error(
            `🚨 ${notificationTitle}: ${notificationBody}`,
            toastOptions
          );
          break;
        case "high":
          toast.warn(
            `⚠️ ${notificationTitle}: ${notificationBody}`,
            toastOptions
          );
          break;
        case "medium":
          toast.info(
            `ℹ️ ${notificationTitle}: ${notificationBody}`,
            toastOptions
          );
          break;
        case "low":
          toast.success(
            `✅ ${notificationTitle}: ${notificationBody}`,
            toastOptions
          );
          break;
        default:
          toast.info(`${notificationTitle}: ${notificationBody}`, toastOptions);
      }

      // Play notification sound based on priority and type
      try {
        await playNotificationSound(
          priority as "critical" | "high" | "medium" | "low",
          notificationType === "system" && priority === "critical"
            ? "error"
            : notificationType === "order"
            ? "info"
            : undefined
        );
      } catch (err) {
        console.log("Could not play notification sound:", err);
      }

      // Show browser notification if page is not visible
      if (
        document.hidden &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          const browserNotification = new Notification(notificationTitle, {
            body: notificationBody,
            icon: payload.notification?.icon || "/firebase-logo.png",
            badge: "/notification-badge.png",
            tag: `notification-${Date.now()}`,
            requireInteraction: priority === "critical",
            silent: priority === "low",
          });

          browserNotification.onclick = () => {
            window.focus();
            browserNotification.close();
          };

          // Auto close after 10 seconds unless critical
          if (priority !== "critical") {
            setTimeout(() => browserNotification.close(), 10000);
          }
        } catch (err) {
          console.log("Could not show browser notification:", err);
        }
      }

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["critical-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["push-notification"] });

      // Handle specific notification types
      switch (notificationType) {
        case "order":
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          break;
        case "user":
          queryClient.invalidateQueries({ queryKey: ["users"] });
          break;
        case "product":
          queryClient.invalidateQueries({ queryKey: ["products"] });
          break;
        case "system":
          queryClient.invalidateQueries({ queryKey: ["system-status"] });
          break;
        default:
          // General refresh
          queryClient.invalidateQueries();
      }
    },
    [queryClient]
  );

  const startListening = useCallback(async () => {
    if (isListening) {
      console.log("Already listening for messages");
      return;
    }

    try {
      setError(null);

      const messagingInstance = await getMessagingInstance();
      if (!messagingInstance) {
        throw new Error("Messaging instance not available");
      }

      console.log("Starting Firebase message listener...");

      // Set up the message listener
      const unsubscribeFunction = onMessage(messagingInstance, handleMessage);

      setUnsubscribe(() => unsubscribeFunction);
      setIsListening(true);

      console.log("Firebase message listener started successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Failed to start message listener:", errorMessage);
      setError(errorMessage);
      setIsListening(false);
    }
  }, [isListening, handleMessage]);

  const stopListening = useCallback(() => {
    if (unsubscribe) {
      unsubscribe();
      setUnsubscribe(null);
    }
    setIsListening(false);
    console.log("Firebase message listener stopped");
  }, [unsubscribe]);

  // Auto-start listening when component mounts
  useEffect(() => {
    startListening();

    // Cleanup on unmount
    return () => {
      stopListening();
    };
  }, []); // Empty dependency array to run only once

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("Page hidden - background message handling active");
      } else {
        console.log("Page visible - foreground message handling active");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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

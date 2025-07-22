import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  requestFCMToken,
  checkNotificationPermission,
} from "../utils/firebaseConfig";
import { useAuth } from "./useAuth";
import { apiClient } from "../server/utils/ApiGateway";

interface TokenRegistrationResult {
  success: boolean;
  token?: string;
  error?: string;
}

interface UseNotificationTokenReturn {
  // State
  fcmToken: string | null;
  isRegistering: boolean;
  isRegistered: boolean;
  hasPermission: boolean;
  error: string | null;

  // Actions
  registerToken: () => Promise<TokenRegistrationResult>;
  refreshToken: () => Promise<TokenRegistrationResult>;
  clearToken: () => void;

  // Utils
  checkPermission: () => Promise<boolean>;
}

export const useNotificationToken = (): UseNotificationTokenReturn => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: authData } = useAuth();
  const queryClient = useQueryClient();

  // Use ref to track if auto-registration has been attempted
  const autoRegistrationAttempted = useRef(false);

  const checkPermission = useCallback(async (): Promise<boolean> => {
    try {
      const permission = await checkNotificationPermission();
      setHasPermission(permission);
      return permission;
    } catch (err) {
      console.error("Permission check failed:", err);
      setHasPermission(false);
      return false;
    }
  }, []);

  // Check permission status on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // Mutation for sending token to backend
  const { mutateAsync: sendTokenToBackend } = useMutation({
    mutationFn: async ({
      userId,
      token,
    }: {
      userId: string;
      token: string;
    }) => {
      const response = await apiClient.patch(`user/${userId}`, {
        FCMToken: token,
      });
      return response.data;
    },
    onSuccess: () => {
      console.log("FCM token successfully registered with backend");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      console.error("Failed to register FCM token with backend:", error);
      throw error;
    },
  });

  const registerToken =
    useCallback(async (): Promise<TokenRegistrationResult> => {
      if (isRegistering) {
        return { success: false, error: "Registration already in progress" };
      }

      setIsRegistering(true);
      setError(null);

      try {
        // Check permission first
        const permission = await checkPermission();
        if (!permission) {
          throw new Error("Notification permission not granted");
        }

        // Get FCM token
        const token = await requestFCMToken();
        if (!token) {
          throw new Error("Failed to get FCM token");
        }

        setFcmToken(token);

        // Send to backend if user is authenticated
        if (authData?.user) {
          let userData;
          try {
            if (typeof authData.user === "string") {
              if (authData.user === "[object Object]") {
                console.error(
                  "Invalid user data format in useNotificationToken"
                );
                throw new Error("Invalid user data format");
              }
              userData = JSON.parse(authData.user);
            } else {
              userData = authData.user;
            }
          } catch (error) {
            console.error(
              "Error parsing user data in useNotificationToken:",
              error
            );
            throw new Error("Failed to parse user data");
          }

          await sendTokenToBackend({
            userId: userData._id,
            token,
          });
        }

        console.log("FCM token registered successfully:", token);

        return {
          success: true,
          token,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Token registration failed:", errorMessage);

        setError(errorMessage);

        // Show user-friendly error messages
        if (errorMessage.includes("permission")) {
          toast.error("Please enable notifications in your browser settings");
        } else if (errorMessage.includes("service worker")) {
          toast.error("Please refresh the page and try again");
        } else {
          toast.error("Failed to register for notifications");
        }

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsRegistering(false);
      }
    }, [authData, isRegistering, checkPermission, sendTokenToBackend]);

  // Auto-register token when user is authenticated and has permission (only once)
  useEffect(() => {
    if (
      authData &&
      hasPermission &&
      !fcmToken &&
      !isRegistering &&
      !autoRegistrationAttempted.current
    ) {
      autoRegistrationAttempted.current = true;
      registerToken();
    }
  }, [authData, hasPermission, fcmToken, isRegistering, registerToken]);

  const refreshToken =
    useCallback(async (): Promise<TokenRegistrationResult> => {
      console.log("Refreshing FCM token...");

      // Clear current token
      setFcmToken(null);
      setError(null);

      // Register new token
      return await registerToken();
    }, [registerToken]);

  const clearToken = useCallback(() => {
    setFcmToken(null);
    setError(null);
    console.log("FCM token cleared");
  }, []);

  const isRegistered = !!fcmToken && !error;

  return {
    // State
    fcmToken,
    isRegistering,
    isRegistered,
    hasPermission,
    error,

    // Actions
    registerToken,
    refreshToken,
    clearToken,

    // Utils
    checkPermission,
  };
};

export default useNotificationToken;

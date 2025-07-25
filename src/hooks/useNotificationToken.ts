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
  token: string | null;
  isRegistering: boolean;
  isRegistered: boolean;
  error: string | null;
  registerToken: () => Promise<TokenRegistrationResult>;
  refreshToken: () => Promise<TokenRegistrationResult>;
  clearToken: () => void;
  retryRegistration: () => void;
}

export const useNotificationToken = (): UseNotificationTokenReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: authData } = useAuth();
  const registrationAttempted = useRef(false);
  const lastRegistrationAttempt = useRef(0);
  const REGISTRATION_COOLDOWN = 30000; // 30 seconds

  // Mutation for sending token to backend
  const tokenRegistrationMutation = useMutation({
    mutationFn: async (fcmToken: string) => {
      if (!authData?.user) {
        throw new Error("No authenticated user found");
      }

      const userData = JSON.parse(authData.user);
      const response = await apiClient.post(
        "push-notification/register-token",
        {
          token: fcmToken,
          userId: userData._id,
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            timestamp: new Date().toISOString(),
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("FCM token registered with backend successfully:", data);
      setIsRegistered(true);
      setError(null);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["push-notification"] });
    },
    onError: (error: any) => {
      console.error("Failed to register FCM token with backend:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Token registration failed";
      setError(errorMessage);
      setIsRegistered(false);

      // Don't show toast for network errors or user not found
      if (!errorMessage.includes("network") && !errorMessage.includes("user")) {
        toast.error(`Token registration failed: ${errorMessage}`);
      }
    },
  });

  // Register FCM token
  const registerToken =
    useCallback(async (): Promise<TokenRegistrationResult> => {
      // Check cooldown
      const now = Date.now();
      if (now - lastRegistrationAttempt.current < REGISTRATION_COOLDOWN) {
        const remainingTime = Math.ceil(
          (REGISTRATION_COOLDOWN - (now - lastRegistrationAttempt.current)) /
            1000
        );
        const error = `Registration cooldown active. Please wait ${remainingTime} seconds.`;
        setError(error);
        return { success: false, error };
      }

      setIsRegistering(true);
      setError(null);
      lastRegistrationAttempt.current = now;

      try {
        // Check notification permission first
        const hasPermission = await checkNotificationPermission();
        if (!hasPermission) {
          throw new Error("Notification permission not granted");
        }

        // Get FCM token
        console.log("Requesting FCM token...");
        const fcmToken = await requestFCMToken();

        if (!fcmToken) {
          throw new Error("Failed to obtain FCM token");
        }

        setToken(fcmToken);
        console.log("FCM token obtained successfully");

        // Register with backend if user is authenticated
        if (authData?.user) {
          await tokenRegistrationMutation.mutateAsync(fcmToken);
        } else {
          console.warn("User not authenticated, skipping backend registration");
          setIsRegistered(false);
        }

        registrationAttempted.current = true;
        return { success: true, token: fcmToken };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Token registration failed:", errorMessage);
        setError(errorMessage);
        setIsRegistered(false);

        // Show user-friendly error messages
        if (errorMessage.includes("permission")) {
          toast.error("Please enable notifications in your browser settings");
        } else if (errorMessage.includes("FCM")) {
          toast.error(
            "Notification service unavailable. Please try again later."
          );
        } else if (!errorMessage.includes("cooldown")) {
          toast.error("Failed to register for notifications");
        }

        return { success: false, error: errorMessage };
      } finally {
        setIsRegistering(false);
      }
    }, [authData, tokenRegistrationMutation]);

  // Refresh token (force re-registration)
  const refreshToken =
    useCallback(async (): Promise<TokenRegistrationResult> => {
      console.log("Refreshing FCM token...");
      setToken(null);
      setIsRegistered(false);
      registrationAttempted.current = false;
      lastRegistrationAttempt.current = 0; // Reset cooldown
      return registerToken();
    }, [registerToken]);

  // Clear token
  const clearToken = useCallback(() => {
    setToken(null);
    setIsRegistered(false);
    setError(null);
    registrationAttempted.current = false;
    console.log("FCM token cleared");
  }, []);

  // Retry registration
  const retryRegistration = useCallback(() => {
    console.log("Retrying token registration...");
    setError(null);
    lastRegistrationAttempt.current = 0; // Reset cooldown
    registerToken();
  }, [registerToken]);

  // Auto-register when user is authenticated and hasn't attempted registration
  useEffect(() => {
    if (
      authData?.user &&
      !registrationAttempted.current &&
      !isRegistering &&
      !token
    ) {
      console.log("Auto-registering FCM token for authenticated user");
      registerToken();
    }
  }, [authData, isRegistering, token, registerToken]);

  // Handle authentication changes
  useEffect(() => {
    if (!authData?.user && token) {
      console.log("User logged out, clearing FCM token");
      clearToken();
    }
  }, [authData, token, clearToken]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending mutations
      tokenRegistrationMutation.reset();
    };
  }, [tokenRegistrationMutation]);

  return {
    token,
    isRegistering: isRegistering || tokenRegistrationMutation.isPending,
    isRegistered,
    error,
    registerToken,
    refreshToken,
    clearToken,
    retryRegistration,
  };
};

export default useNotificationToken;

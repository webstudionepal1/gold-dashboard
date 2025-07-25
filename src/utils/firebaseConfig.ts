// firebase-config.ts

import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8dPryBIdZ-u1aywclZ73vqS-1FlJrq18",
  authDomain: "notification-f5de6.firebaseapp.com",
  projectId: "notification-f5de6",
  storageBucket: "notification-f5de6.firebasestorage.app",
  messagingSenderId: "352232158982",
  appId: "1:352232158982:web:6ab78e1337d038595a1087",
  measurementId: "G-3G84XTT0Y9",
};

// VAPID key for web push notifications
const VAPID_KEY =
  "BNHwiiLMuGK9UjBkuaNalAqHCh-k-dIiVY_6raUv7Y5pVwM4C4SEr8BThOi7UuIsEmMJRvVJmuXEUfKJhumXzC4";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize messaging conditionally
export const getMessagingInstance = async () => {
  try {
    const isFCMSupported = await isSupported();
    if (!isFCMSupported) {
      throw new Error(
        "Firebase Cloud Messaging is not supported in this browser"
      );
    }
    return getMessaging(app);
  } catch (error) {
    console.error("Error initializing messaging:", error);
    return null;
  }
};

// Register service worker with enhanced error handling and retry logic
export const registerServiceWorker = async (
  retryCount = 0,
  maxRetries = 2
): Promise<ServiceWorkerRegistration | false> => {
  if (!("serviceWorker" in navigator)) {
    console.error("Service Worker is not supported in this browser");
    return false;
  }

  try {
    // Check if we're in a secure context
    if (!window.isSecureContext) {
      console.warn("Service Worker requires a secure context (HTTPS)");
      return false;
    }

    // First, unregister any existing service workers to avoid conflicts
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      if (registration.scope.includes(window.location.origin)) {
        await registration.unregister();
        console.log("Unregistered existing service worker");
      }
    }

    // Register the service worker with timeout protection
    const registrationPromise = navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      {
        scope: "/",
        updateViaCache: "none", // Prevent caching issues
      }
    );

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("Service worker registration timeout")),
        10000
      );
    });

    const registration = (await Promise.race([
      registrationPromise,
      timeoutPromise,
    ])) as ServiceWorkerRegistration;

    // Wait for the service worker to be ready
    if (registration.installing) {
      console.log("Service worker installing");
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Service worker installation timeout"));
        }, 15000);

        registration.installing?.addEventListener("statechange", (e: any) => {
          clearTimeout(timeout);
          if (e?.target?.state === "activated") {
            console.log("Service worker activated");
            resolve(true);
          } else if (e?.target?.state === "redundant") {
            reject(new Error("Service worker became redundant"));
          }
        });
      });
    }

    // Ensure service worker is ready
    await navigator.serviceWorker.ready;
    console.log("Service Worker registered successfully:", registration);
    return registration;
  } catch (error) {
    console.error(
      `Service Worker registration failed (attempt ${retryCount + 1}):`,
      error
    );

    // Retry logic with exponential backoff
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      console.log(`Retrying service worker registration in ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return registerServiceWorker(retryCount + 1, maxRetries);
    }

    return false;
  }
};

// Request FCM Token with enhanced error handling and retry logic
export const requestFCMToken = async (
  retryCount = 0,
  maxRetries = 3
): Promise<string | null> => {
  try {
    // Check if FCM is supported
    const isFCMSupported = await isSupported();
    if (!isFCMSupported) {
      throw new Error(
        "Firebase Cloud Messaging is not supported in this browser"
      );
    }

    // First ensure the service worker is registered with retry
    let swRegistration = await registerServiceWorker();
    if (!swRegistration) {
      // Wait a bit and try again
      await new Promise((resolve) => setTimeout(resolve, 1000));
      swRegistration = await registerServiceWorker();
      if (!swRegistration) {
        throw new Error("Failed to register service worker after retry");
      }
    }

    // Then check notification permissions
    const hasPermission = await checkNotificationPermission();
    if (!hasPermission) {
      throw new Error("Notification permission not granted");
    }

    // Initialize messaging
    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) {
      throw new Error("Failed to initialize messaging");
    }

    // Get FCM token with timeout protection
    console.log("Requesting FCM token...");
    const tokenPromise = getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("FCM token request timeout")), 15000);
    });

    const fcmToken = await Promise.race([tokenPromise, timeoutPromise]);

    if (!fcmToken) {
      throw new Error("No registration token available");
    }

    console.log("FCM Token obtained successfully");
    return fcmToken as string;
  } catch (err) {
    console.error(`Error getting FCM token (attempt ${retryCount + 1}):`, err);

    // Specific error handling for common issues
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    if (
      errorMessage.includes("push service") ||
      errorMessage.includes("AbortError")
    ) {
      console.warn(
        "Push service error - this may be due to network issues or browser restrictions"
      );
    } else if (errorMessage.includes("failed to register")) {
      console.warn(
        "Service worker registration issue - try clearing browser cache"
      );
    } else if (errorMessage.includes("permission")) {
      console.warn("Permission issue - check browser notification settings");
    } else if (errorMessage.includes("timeout")) {
      console.warn("Request timeout - network may be slow");
    }

    // Retry logic with exponential backoff
    if (retryCount < maxRetries && !errorMessage.includes("permission")) {
      const delay = Math.pow(2, retryCount) * 2000; // 2s, 4s, 8s
      console.log(`Retrying FCM token request in ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return requestFCMToken(retryCount + 1, maxRetries);
    }

    return null;
  }
};

// Listen for FCM Messages with enhanced error handling
export const onMessageListener = async () => {
  try {
    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) {
      throw new Error("Messaging not initialized");
    }

    return new Promise((resolve) => {
      onMessage(messagingInstance, (payload: any) => {
        console.log("Message received in foreground:", payload);
        resolve(payload);
      });
    });
  } catch (error) {
    console.error("Error setting up message listener:", error);
    return Promise.resolve(null);
  }
};

// Enhanced notification permission check with detailed browser detection
export const checkNotificationPermission = async (): Promise<boolean> => {
  // Browser support check
  if (!("Notification" in window)) {
    console.error("Notifications not supported in this browser");
    return false;
  }

  // Browser-specific detection
  const isBrave =
    ((navigator as any)?.brave &&
      (await (navigator as any)?.brave.isBrave())) ||
    false;
  const isChrome = navigator.userAgent.includes("Chrome") && !isBrave;
  const isFirefox = navigator.userAgent.includes("Firefox");
  const isSafari = navigator.userAgent.includes("Safari") && !isChrome;

  console.log(
    `Browser detection: ${
      isBrave
        ? "Brave"
        : isChrome
        ? "Chrome"
        : isFirefox
        ? "Firefox"
        : isSafari
        ? "Safari"
        : "Other"
    }`
  );

  // Handle existing permission
  if (Notification.permission === "granted") {
    console.log("Notification permission already granted");
    return true;
  }

  if (Notification.permission === "denied") {
    console.warn("Notification permission denied by user");
    return false;
  }

  // Request permission with browser-specific handling
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted");
      return true;
    } else {
      console.warn(`Permission not granted: ${permission}`);
      return false;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);

    // Check for browser-specific issues
    if (isBrave) {
      console.warn(
        "Brave browser detected - check Shields settings and site permissions"
      );
    } else if (isChrome) {
      console.warn(
        "Chrome detected - check site permissions and third-party cookie settings"
      );
    } else if (isFirefox) {
      console.warn(
        "Firefox detected - check privacy settings and notification permissions"
      );
    } else if (isSafari) {
      console.warn("Safari detected - notification support may be limited");
    }

    return false;
  }
};

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
export const registerServiceWorker = async (retryCount = 0, maxRetries = 2) => {
  if (!("serviceWorker" in navigator)) {
    console.error("Service Worker is not supported in this browser");
    return false;
  }

  try {
    console.log("Registering service worker...");

    // Check if service worker is already registered and active
    const existingRegistration = await navigator.serviceWorker.getRegistration(
      "/firebase-messaging-sw.js"
    );

    if (existingRegistration && existingRegistration.active) {
      console.log(
        "Service worker already registered and active:",
        existingRegistration
      );
      return existingRegistration;
    }

    // If existing registration is not active, unregister it
    if (existingRegistration) {
      await existingRegistration.unregister();
      console.log("Unregistered inactive service worker");
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

    // Wait for the service worker to be activated
    if (registration.installing) {
      console.log("Service worker installing");

      // Wait for installation to complete with timeout
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Service worker installation timeout"));
        }, 15000);

        registration.installing!.addEventListener("statechange", (e: any) => {
          if (e?.target?.state === "activated") {
            clearTimeout(timeout);
            console.log("Service worker activated");
            resolve(true);
          } else if (e?.target?.state === "redundant") {
            clearTimeout(timeout);
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
    console.error("Service Worker registration failed:", error);

    // Retry logic for registration failures
    if (retryCount < maxRetries) {
      console.log(
        `Retrying service worker registration (${
          retryCount + 1
        }/${maxRetries})...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * (retryCount + 1))
      );
      return registerServiceWorker(retryCount + 1, maxRetries);
    }

    return false;
  }
};

// Check notification permission with more detailed error handling
export const checkNotificationPermission = async () => {
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

  console.log(
    `Browser detection: ${isBrave ? "Brave" : isChrome ? "Chrome" : "Other"}`
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

    // Check for Brave/Chrome specific issues
    if (isBrave) {
      console.warn(
        "Brave browser detected - check Shields settings and site permissions"
      );
    } else if (isChrome) {
      console.warn(
        "Chrome detected - check site permissions and third-party cookie settings"
      );
    }

    return false;
  }
};

// Request FCM Token with enhanced error handling and retry logic
export const requestFCMToken = async (retryCount = 0, maxRetries = 3) => {
  try {
    // Feature detection
    const isBrave =
      ((navigator as any)?.brave &&
        (await (navigator as any)?.brave.isBrave())) ||
      false;

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

    // Wait for service worker to be ready
    if (swRegistration.installing) {
      await new Promise((resolve) => {
        swRegistration.installing!.addEventListener("statechange", () => {
          if (swRegistration.installing!.state === "installed") {
            resolve(void 0);
          }
        });
      });
    }

    // Then check notification permissions
    const hasPermission = await checkNotificationPermission();
    if (!hasPermission) {
      throw new Error("Notification permission not granted");
    }

    // Initialize messaging with retry
    let messagingInstance = await getMessagingInstance();
    if (!messagingInstance) {
      // Wait and try again
      await new Promise((resolve) => setTimeout(resolve, 500));
      messagingInstance = await getMessagingInstance();
      if (!messagingInstance) {
        throw new Error("Failed to initialize messaging after retry");
      }
    }

    // Get FCM token with additional options for Chrome/Brave
    console.log("Requesting FCM token...");

    // Add timeout to prevent hanging
    const tokenPromise = getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("FCM token request timeout")), 10000);
    });

    const fcmToken = (await Promise.race([
      tokenPromise,
      timeoutPromise,
    ])) as string;

    if (!fcmToken) {
      throw new Error("No registration token available");
    }

    console.log("FCM Token obtained successfully");
    return fcmToken;
  } catch (err) {
    console.error("Error getting FCM token:", err);

    // Specific error handling for common issues
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    if (
      errorMessage.includes("push service") ||
      errorMessage.includes("AbortError")
    ) {
      console.warn(
        "Push service error - check your network connection and try again"
      );

      // Retry logic for push service errors
      if (retryCount < maxRetries) {
        console.log(
          `Retrying FCM token request (${retryCount + 1}/${maxRetries})...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, 2000 * (retryCount + 1))
        ); // Exponential backoff
        return requestFCMToken(retryCount + 1, maxRetries);
      }
    } else if (errorMessage.includes("failed to register")) {
      console.warn(
        "Service worker registration issue - try clearing browser cache"
      );
    } else if (errorMessage.includes("permission")) {
      console.warn("Permission issue - check browser notification settings");
    } else if (errorMessage.includes("timeout")) {
      console.warn("FCM token request timed out - network or server issue");
    }

    return null;
  }
};

// Listen for FCM Messages
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

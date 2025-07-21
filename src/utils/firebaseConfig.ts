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

// Register service worker with broader compatibility
export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) {
    console.error("Service Worker is not supported in this browser");
    return false;
  }

  try {
    // First, unregister any existing service workers to avoid conflicts
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      if (registration.scope.includes(window.location.origin)) {
        await registration.unregister();
        console.log("Unregistered existing service worker");
      }
    }

    // Register the service worker with a broader scope
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      {
        scope: "/",
        updateViaCache: "none", // Prevent caching issues
      }
    );

    // Wait for the service worker to be activated
    if (registration.installing) {
      console.log("Service worker installing");

      // Wait for installation to complete
      await new Promise((resolve) => {
        registration?.installing?.addEventListener("statechange", (e: any) => {
          if (e?.target?.state === "activated") {
            console.log("Service worker activated");
            resolve(true);
          }
        });
      });
    }

    console.log("Service Worker registered successfully:", registration);
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
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

// Request FCM Token with browser-specific handling
export const requestFCMToken = async () => {
  try {
    // Feature detection
    const isBrave =
      ((navigator as any)?.brave &&
        (await (navigator as any)?.brave.isBrave())) ||
      false;

    // First ensure the service worker is registered
    const swRegistration = await registerServiceWorker();
    if (!swRegistration) {
      throw new Error("Failed to register service worker");
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

    // Get FCM token with additional options for Chrome/Brave
    console.log("Requesting FCM token...");
    const fcmToken = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (!fcmToken) {
      throw new Error("No registration token available");
    }

    console.log("FCM Token:", fcmToken);
    return fcmToken;
  } catch (err) {
    console.error("Error getting FCM token:", err);

    // Specific error handling for common issues
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    if (errorMessage.includes("push service")) {
      console.warn(
        "Push service error - check your network connection and try again"
      );
    } else if (errorMessage.includes("failed to register")) {
      console.warn(
        "Service worker registration issue - try clearing browser cache"
      );
    } else if (errorMessage.includes("permission")) {
      console.warn("Permission issue - check browser notification settings");
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

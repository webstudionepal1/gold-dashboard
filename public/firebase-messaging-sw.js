// firebase-messaging-sw.js (place in public folder)

// Log service worker initialization
console.log('Firebase Messaging SW initializing...');

// Import Firebase scripts
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js'
);

// Initialize Firebase with explicit error handling
try {
  firebase.initializeApp({
    apiKey: 'AIzaSyA8dPryBIdZ-u1aywclZ73vqS-1FlJrq18',
    authDomain: 'notification-f5de6.firebaseapp.com',
    projectId: 'notification-f5de6',
    storageBucket: 'notification-f5de6.firebasestorage.app',
    messagingSenderId: '352232158982',
    appId: '1:352232158982:web:6ab78e1337d038595a1087',
    measurementId: 'G-3G84XTT0Y9',
  });
  console.log('Firebase initialized in service worker');
} catch (error) {
  console.error('Failed to initialize Firebase in service worker:', error);
}

// Register event listeners for service worker lifecycle
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(clients.claim()); // Take control of clients immediately
});

// Initialize Firebase Cloud Messaging with error handling
let messaging;
try {
  messaging = firebase.messaging();
  console.log('Firebase messaging initialized in service worker');
} catch (error) {
  console.error('Failed to initialize messaging in service worker:', error);
}

// Handle background messages
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: '/firebase-logo.png',
      data: payload.data,
      // Add additional options to make notification more noticeable
      badge: '/notification-badge.png',
      vibrate: [200, 100, 200],
      tag: 'notification-' + Date.now(), // Ensure unique notifications
      requireInteraction: true, // Will not auto dismiss on some browsers
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  // This will open the app or specific page when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      // If a window client is available, focus it
      const hadWindowToFocus = clientsArr.some((windowClient) => {
        if (windowClient.url === '/' && 'focus' in windowClient) {
          return windowClient.focus();
        }
        return false;
      });

      // If no window client, open new window
      if (!hadWindowToFocus && clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle push messages directly (backup for browsers where onBackgroundMessage fails)
self.addEventListener('push', (event) => {
  console.log('Push message received in service worker:', event);

  if (!event.data) {
    console.log('No data in push event');
    return;
  }

  try {
    const data = event.data.json();
    console.log('Push data:', data);

    const notificationTitle = data.notification?.title || 'New Notification';
    const notificationOptions = {
      body: data.notification?.body || '',
      icon: '/firebase-logo.png',
      data: data.data,
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  } catch (error) {
    console.error('Error processing push message:', error);
  }
});

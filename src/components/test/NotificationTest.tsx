import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNotifications } from "../../contexts/NotificationContext";
import useNotificationToken from "../../hooks/useNotificationToken";
import useFirebaseMessaging from "../../hooks/useFirebaseMessaging";
import { useCreateSendPushNotification } from "../../server/api/push-notifications";
import { useAuth } from "../../hooks/useAuth";

const NotificationTest: React.FC = () => {
  const [testMessage, setTestMessage] = useState({
    title: "Test Notification",
    body: "This is a test notification message",
    type: "test",
    priority: "medium",
  });

  const {
    isInitialized,
    fcmToken,
    permissionStatus,
    isSupported,
    isLoading,
    error,
    initializeNotifications,
    requestPermission,
  } = useNotifications();

  const {
    fcmToken: hookToken,
    isRegistering,
    isRegistered,
    hasPermission,
    registerToken,
    refreshToken,
  } = useNotificationToken();

  const {
    isListening,
    lastMessage,
    messageCount,
    error: messagingError,
  } = useFirebaseMessaging();

  const { mutate: sendNotification, isPending: isSending } =
    useCreateSendPushNotification();
  const { data: authData } = useAuth();

  const handleSendTestNotification = () => {
    if (!fcmToken) {
      toast.error("FCM token not available");
      return;
    }

    let userData;
    try {
      if (typeof authData?.user === "string") {
        if (authData.user === "[object Object]") {
          toast.error("Invalid user session. Please log in again.");
          return;
        }
        userData = JSON.parse(authData.user);
      } else {
        userData = authData?.user;
      }
    } catch (error) {
      toast.error("Error parsing user data. Please log in again.");
      return;
    }

    if (!userData) {
      toast.error("User not authenticated");
      return;
    }

    sendNotification({
      token: fcmToken,
      title: testMessage.title,
      body: testMessage.body,
      type: testMessage.type,
      notificationStatus: "sent",
      user: userData._id,
    });
  };

  const handleRequestPermission = async () => {
    try {
      const granted = await requestPermission();
      if (granted) {
        toast.success("Notification permission granted!");
      } else {
        toast.error("Notification permission denied");
      }
    } catch (err) {
      toast.error("Failed to request permission");
    }
  };

  const handleInitializeNotifications = async () => {
    try {
      await initializeNotifications();
      toast.success("Notifications initialized successfully!");
    } catch (err) {
      toast.error("Failed to initialize notifications");
    }
  };

  const handleRegisterToken = async () => {
    try {
      const result = await registerToken();
      if (result.success) {
        toast.success("FCM token registered successfully!");
      } else {
        toast.error(`Token registration failed: ${result.error}`);
      }
    } catch (err) {
      toast.error("Failed to register token");
    }
  };

  const handleRefreshToken = async () => {
    try {
      const result = await refreshToken();
      if (result.success) {
        toast.success("FCM token refreshed successfully!");
      } else {
        toast.error(`Token refresh failed: ${result.error}`);
      }
    } catch (err) {
      toast.error("Failed to refresh token");
    }
  };

  const getStatusColor = (status: boolean | null) => {
    if (status === null) return "text-gray-500";
    return status ? "text-green-600" : "text-red-600";
  };

  const getStatusText = (status: boolean | null) => {
    if (status === null) return "Unknown";
    return status ? "Yes" : "No";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Notification System Test
      </h2>

      {/* Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            System Status
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Browser Support:</span>
              <span className={getStatusColor(isSupported)}>
                {getStatusText(isSupported)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Initialized:</span>
              <span className={getStatusColor(isInitialized)}>
                {getStatusText(isInitialized)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Permission:</span>
              <span className={getStatusColor(hasPermission)}>
                {permissionStatus || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Token Registered:</span>
              <span className={getStatusColor(isRegistered)}>
                {getStatusText(isRegistered)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Listening:</span>
              <span className={getStatusColor(isListening)}>
                {getStatusText(isListening)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Token Info
          </h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">FCM Token:</span>
              <div className="text-xs text-gray-600 break-all mt-1">
                {fcmToken ? `${fcmToken.substring(0, 50)}...` : "Not available"}
              </div>
            </div>
            <div>
              <span className="font-medium">Messages Received:</span>
              <span className="ml-2 text-blue-600">{messageCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {(error || messagingError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="text-red-800 font-semibold">Errors:</h4>
          {error && <p className="text-red-600 text-sm">Context: {error}</p>}
          {messagingError && (
            <p className="text-red-600 text-sm">Messaging: {messagingError}</p>
          )}
        </div>
      )}

      {/* Last Message Display */}
      {lastMessage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-blue-800 font-semibold">
            Last Received Message:
          </h4>
          <p className="text-sm">
            <strong>Title:</strong> {lastMessage.notification?.title}
          </p>
          <p className="text-sm">
            <strong>Body:</strong> {lastMessage.notification?.body}
          </p>
          <p className="text-sm">
            <strong>Data:</strong> {JSON.stringify(lastMessage.data)}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <button
          onClick={handleRequestPermission}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
          Request Permission
        </button>

        <button
          onClick={handleInitializeNotifications}
          disabled={isLoading || isInitialized}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
          Initialize Notifications
        </button>

        <button
          onClick={handleRegisterToken}
          disabled={isRegistering}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
          {isRegistering ? "Registering..." : "Register Token"}
        </button>

        <button
          onClick={handleRefreshToken}
          disabled={isRegistering}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
          Refresh Token
        </button>
      </div>

      {/* Test Message Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Send Test Notification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={testMessage.title}
              onChange={(e) =>
                setTestMessage((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={testMessage.type}
              onChange={(e) =>
                setTestMessage((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="test">Test</option>
              <option value="order">Order</option>
              <option value="user">User</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            value={testMessage.body}
            onChange={(e) =>
              setTestMessage((prev) => ({ ...prev, body: e.target.value }))
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSendTestNotification}
          disabled={isSending || !fcmToken}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg disabled:opacity-50">
          {isSending ? "Sending..." : "Send Test Notification"}
        </button>
      </div>
    </div>
  );
};

export default NotificationTest;

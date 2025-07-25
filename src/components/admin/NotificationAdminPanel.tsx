import React, { useState } from "react";
import { Send, Users, Bell, BarChart3, Settings, TestTube } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import {
  useCreateSendPushNotification,
  useCreateSendBulkPushNotification,
} from "../../server/api/push-notifications";
import { useAuth } from "../../hooks/useAuth";
import {
  testNotificationSound,
  setNotificationSoundsEnabled,
  setNotificationVolume,
} from "../../utils/notificationSounds";
import useCriticalNotifications from "../../hooks/useCriticalNotifications";

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
}

const defaultTemplates: NotificationTemplate[] = [
  {
    id: "1",
    name: "Order Received",
    title: "New Order Received",
    body: "You have received a new order. Please check your dashboard.",
    type: "order",
    priority: "high",
  },
  {
    id: "2",
    name: "Payment Confirmed",
    title: "Payment Confirmed",
    body: "Payment has been successfully processed for your order.",
    type: "payment",
    priority: "medium",
  },
  {
    id: "3",
    name: "Critical Alert",
    title: "Critical System Alert",
    body: "Immediate attention required. Please check the system status.",
    type: "alert",
    priority: "critical",
  },
  {
    id: "4",
    name: "Low Stock Warning",
    title: "Low Stock Alert",
    body: "Some items are running low in stock. Please reorder soon.",
    type: "inventory",
    priority: "medium",
  },
];

const NotificationAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "send" | "templates" | "analytics" | "settings"
  >("send");
  const [selectedTemplate, setSelectedTemplate] =
    useState<NotificationTemplate | null>(null);
  const [customNotification, setCustomNotification] = useState({
    title: "",
    body: "",
    type: "general",
    priority: "medium" as "critical" | "high" | "medium" | "low",
  });
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);

  const { data: authData } = useAuth();
  const { getNotificationStats } = useCriticalNotifications();
  const sendNotificationMutation = useCreateSendPushNotification();
  const sendBulkNotificationMutation = useCreateSendBulkPushNotification();

  const stats = getNotificationStats();

  const handleSendNotification = async (notification: any, isBulk = false) => {
    if (!authData?.user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const notificationData = {
        token: "", // Will be handled by backend
        title: notification.title,
        body: notification.body,
        type: notification.type,
        priority: notification.priority,
        notificationStatus: "sent",
        user: JSON.parse(authData.user)._id,
      };

      if (isBulk) {
        await sendBulkNotificationMutation.mutateAsync(notificationData);
        toast.success("Bulk notification sent successfully!");
      } else {
        await sendNotificationMutation.mutateAsync(notificationData);
        toast.success("Notification sent successfully!");
      }

      // Reset form
      setCustomNotification({
        title: "",
        body: "",
        type: "general",
        priority: "medium",
      });
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Failed to send notification:", error);
      toast.error("Failed to send notification");
    }
  };

  const handleTestSound = (soundType: string) => {
    testNotificationSound(soundType as any);
    toast.info(`Testing ${soundType} sound`);
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundsEnabled(enabled);
    setNotificationSoundsEnabled(enabled);
    toast.info(`Notification sounds ${enabled ? "enabled" : "disabled"}`);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setNotificationVolume(newVolume);
  };

  const renderSendTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Quick Templates
          </h3>
          <div className="space-y-2">
            {defaultTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedTemplate?.id === template.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium">{template.name}</div>
                <div className="text-sm text-gray-600">{template.title}</div>
                <div
                  className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                    template.priority === "critical"
                      ? "bg-red-100 text-red-800"
                      : template.priority === "high"
                      ? "bg-orange-100 text-orange-800"
                      : template.priority === "medium"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {template.priority}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Notification Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Send Notification
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={selectedTemplate?.title || customNotification.title}
                onChange={(e) =>
                  setCustomNotification((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notification title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={selectedTemplate?.body || customNotification.body}
                onChange={(e) =>
                  setCustomNotification((prev) => ({
                    ...prev,
                    body: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notification message"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={selectedTemplate?.type || customNotification.type}
                  onChange={(e) =>
                    setCustomNotification((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="order">Order</option>
                  <option value="payment">Payment</option>
                  <option value="alert">Alert</option>
                  <option value="inventory">Inventory</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={
                    selectedTemplate?.priority || customNotification.priority
                  }
                  onChange={(e) =>
                    setCustomNotification((prev) => ({
                      ...prev,
                      priority: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() =>
                  handleSendNotification(selectedTemplate || customNotification)
                }
                disabled={sendNotificationMutation.isPending}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                {sendNotificationMutation.isPending
                  ? "Sending..."
                  : "Send to Me"}
              </button>
              <button
                onClick={() =>
                  handleSendNotification(
                    selectedTemplate || customNotification,
                    true
                  )
                }
                disabled={sendBulkNotificationMutation.isPending}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Users className="w-4 h-4 mr-2" />
                {sendBulkNotificationMutation.isPending
                  ? "Sending..."
                  : "Send to All"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2" />
        Notification Analytics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">Total Notifications</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {stats.unread}
          </div>
          <div className="text-sm text-orange-800">Unread</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {stats.critical}
          </div>
          <div className="text-sm text-red-800">Critical</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.high}</div>
          <div className="text-sm text-green-800">High Priority</div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2" />
        Notification Settings
      </h3>
      <div className="space-y-6">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={soundsEnabled}
              onChange={(e) => handleSoundToggle(e.target.checked)}
              className="mr-2"
            />
            Enable notification sounds
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Test Sounds
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {["critical", "high", "medium", "low"].map((sound) => (
              <button
                key={sound}
                onClick={() => handleTestSound(sound)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
              >
                Test {sound}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Notification Admin Panel
        </h1>
        <p className="text-gray-600">Manage and send notifications to users</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "send", label: "Send Notifications", icon: Send },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "settings", label: "Settings", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "send" && renderSendTab()}
        {activeTab === "analytics" && renderAnalyticsTab()}
        {activeTab === "settings" && renderSettingsTab()}
      </motion.div>
    </div>
  );
};

export default NotificationAdminPanel;

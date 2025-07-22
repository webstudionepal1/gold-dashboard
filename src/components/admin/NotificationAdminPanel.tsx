import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateSendPushNotification,
  useCreateSendBulkPushNotification,
  useGetNotifications,
} from "../../server/api/push-notifications";
import { useAuth } from "../../hooks/useAuth";
import { notificationPersistence } from "../../utils/notificationPersistence";
import { testNotificationSound } from "../../utils/notificationSounds";

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  type: string;
  priority: "low" | "medium" | "high" | "critical";
  category: string;
}

const DEFAULT_TEMPLATES: NotificationTemplate[] = [
  {
    id: "new-order",
    name: "New Order Alert",
    title: "New Order Received",
    body: "You have received a new order #{orderNumber}",
    type: "order",
    priority: "high",
    category: "Orders",
  },
  {
    id: "order-completed",
    name: "Order Completed",
    title: "Order Completed",
    body: "Order #{orderNumber} has been completed successfully",
    type: "order",
    priority: "medium",
    category: "Orders",
  },
  {
    id: "system-maintenance",
    name: "System Maintenance",
    title: "Scheduled Maintenance",
    body: "System maintenance is scheduled for {date} at {time}",
    type: "system",
    priority: "critical",
    category: "System",
  },
  {
    id: "user-registration",
    name: "New User Registration",
    title: "New User Registered",
    body: "A new user {userName} has registered",
    type: "user",
    priority: "low",
    category: "Users",
  },
];

const NotificationAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "send" | "templates" | "analytics"
  >("send");
  const [selectedTemplate, setSelectedTemplate] =
    useState<NotificationTemplate | null>(null);
  const [customNotification, setCustomNotification] = useState({
    title: "",
    body: "",
    type: "general",
    priority: "medium" as "low" | "medium" | "high" | "critical",
    targetType: "all" as "all" | "specific" | "role",
    targetValue: "",
  });
  const [templates, setTemplates] =
    useState<NotificationTemplate[]>(DEFAULT_TEMPLATES);
  const [newTemplate, setNewTemplate] = useState<Partial<NotificationTemplate>>(
    {
      name: "",
      title: "",
      body: "",
      type: "general",
      priority: "medium",
      category: "General",
    }
  );

  const { data: authData } = useAuth();
  const { mutate: sendNotification, isPending: isSending } =
    useCreateSendPushNotification();
  const { mutate: sendBulkNotification, isPending: isSendingBulk } =
    useCreateSendBulkPushNotification();
  const { data: notificationData } = useGetNotifications();
  const queryClient = useQueryClient();

  // Load templates from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem("notification-templates");
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        setTemplates([...DEFAULT_TEMPLATES, ...parsed]);
      } catch (error) {
        console.error("Failed to load templates:", error);
      }
    }
  }, []);

  const saveTemplates = (updatedTemplates: NotificationTemplate[]) => {
    const customTemplates = updatedTemplates.filter(
      (template) => !DEFAULT_TEMPLATES.find((def) => def.id === template.id)
    );
    localStorage.setItem(
      "notification-templates",
      JSON.stringify(customTemplates)
    );
    setTemplates(updatedTemplates);
  };

  const handleSendCustomNotification = () => {
    if (!customNotification.title || !customNotification.body) {
      toast.error("Please fill in title and message");
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

    // For now, send to current user (in real app, implement user selection)
    sendNotification({
      token: "", // Will be handled by backend
      title: customNotification.title,
      body: customNotification.body,
      type: customNotification.type,
      notificationStatus: "sent",
      user: userData._id,
    });
  };

  const handleUseTemplate = (template: NotificationTemplate) => {
    setCustomNotification({
      title: template.title,
      body: template.body,
      type: template.type,
      priority: template.priority,
      targetType: "all",
      targetValue: "",
    });
    setSelectedTemplate(template);
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.title || !newTemplate.body) {
      toast.error("Please fill in all template fields");
      return;
    }

    const template: NotificationTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name!,
      title: newTemplate.title!,
      body: newTemplate.body!,
      type: newTemplate.type!,
      priority: newTemplate.priority!,
      category: newTemplate.category!,
    };

    const updatedTemplates = [...templates, template];
    saveTemplates(updatedTemplates);

    setNewTemplate({
      name: "",
      title: "",
      body: "",
      type: "general",
      priority: "medium",
      category: "General",
    });

    toast.success("Template saved successfully");
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (DEFAULT_TEMPLATES.find((t) => t.id === templateId)) {
      toast.error("Cannot delete default templates");
      return;
    }

    const updatedTemplates = templates.filter((t) => t.id !== templateId);
    saveTemplates(updatedTemplates);
    toast.success("Template deleted");
  };

  const handleTestSound = async (
    priority: "low" | "medium" | "high" | "critical"
  ) => {
    try {
      await testNotificationSound(priority);
      toast.success(`Played ${priority} priority sound`);
    } catch (error) {
      toast.error("Failed to play sound");
    }
  };

  const stats = notificationPersistence.getStats();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Notification Admin Panel
      </h2>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { key: "send", label: "Send Notifications" },
          { key: "templates", label: "Templates" },
          { key: "analytics", label: "Analytics" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Send Notifications Tab */}
      {activeTab === "send" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Custom Notification Form */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Send Custom Notification
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={customNotification.title}
                    onChange={(e) =>
                      setCustomNotification((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={customNotification.body}
                    onChange={(e) =>
                      setCustomNotification((prev) => ({
                        ...prev,
                        body: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Notification message"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={customNotification.type}
                      onChange={(e) =>
                        setCustomNotification((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="general">General</option>
                      <option value="order">Order</option>
                      <option value="user">User</option>
                      <option value="product">Product</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={customNotification.priority}
                      onChange={(e) =>
                        setCustomNotification((prev) => ({
                          ...prev,
                          priority: e.target.value as any,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSendCustomNotification}
                    disabled={isSending}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                    {isSending ? "Sending..." : "Send Notification"}
                  </button>

                  <button
                    onClick={() => handleTestSound(customNotification.priority)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                    Test Sound
                  </button>
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Quick Templates</h3>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleUseTemplate(template)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {template.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {template.title}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              template.priority === "critical"
                                ? "bg-red-100 text-red-800"
                                : template.priority === "high"
                                ? "bg-orange-100 text-orange-800"
                                : template.priority === "medium"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                            {template.priority}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                            {template.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          {/* Create New Template */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Create New Template</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Template name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newTemplate.category}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Template category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTemplate.title}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Notification title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newTemplate.type}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="general">General</option>
                  <option value="order">Order</option>
                  <option value="user">User</option>
                  <option value="product">Product</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Template
              </label>
              <textarea
                value={newTemplate.body}
                onChange={(e) =>
                  setNewTemplate((prev) => ({ ...prev, body: e.target.value }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Use {variable} for dynamic content"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use variables like {"{orderNumber}"}, {"{userName}"}, {"{date}"}{" "}
                for dynamic content
              </p>
            </div>

            <button
              onClick={handleSaveTemplate}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
              Save Template
            </button>
          </div>

          {/* Template List */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Existing Templates</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">
                      {template.name}
                    </h4>
                    {!DEFAULT_TEMPLATES.find((t) => t.id === template.id) && (
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-500 hover:text-red-700 text-sm">
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.title}</p>
                  <p className="text-xs text-gray-500 mb-3">{template.body}</p>
                  <div className="flex gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        template.priority === "critical"
                          ? "bg-red-100 text-red-800"
                          : template.priority === "high"
                          ? "bg-orange-100 text-orange-800"
                          : template.priority === "medium"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                      {template.priority}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                      {template.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">
                Total Notifications
              </h3>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800">Unread</h3>
              <p className="text-2xl font-bold text-orange-600">
                {stats.unread}
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800">
                Pending Sync
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800">Failed</h3>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">By Priority</h3>
              <div className="space-y-2">
                {Object.entries(stats.byPriority).map(([priority, count]) => (
                  <div key={priority} className="flex justify-between">
                    <span className="capitalize">{priority}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">By Type</h3>
              <div className="space-y-2">
                {Object.entries(stats.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span className="capitalize">{type}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationAdminPanel;

import React, { useState } from 'react';
import { TestTube, Bell, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';
import { useNotifications } from '../../contexts/NotificationContext';
import useNotificationToken from '../../hooks/useNotificationToken';
import useFirebaseMessaging from '../../hooks/useFirebaseMessaging';
import useCriticalNotifications from '../../hooks/useCriticalNotifications';
import { testNotificationSound } from '../../utils/notificationSounds';

const NotificationTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  const {
    isInitialized,
    fcmToken,
    isSupported,
    isLoading,
    error,
    initializeNotifications,
    requestPermission,
    retryInitialization,
  } = useNotifications();

  const {
    token: hookToken,
    isRegistering,
    isRegistered,
    error: tokenError,
    registerToken,
    refreshToken,
  } = useNotificationToken();

  const {
    isListening,
    lastMessage,
    messageCount,
    error: messagingError,
    startListening,
  } = useFirebaseMessaging();

  const {
    notifications,
    unreadCount,
    getNotificationStats,
  } = useCriticalNotifications();

  const stats = getNotificationStats();

  const runTest = async (testName: string, testFn: () => Promise<boolean>) => {
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testName]: result }));
      return result;
    } catch (error) {
      console.error(`Test ${testName} failed:`, error);
      setTestResults(prev => ({ ...prev, [testName]: false }));
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({});

    const tests = [
      {
        name: 'Browser Support',
        test: async () => {
          return isSupported;
        },
      },
      {
        name: 'Notification Permission',
        test: async () => {
          return await requestPermission();
        },
      },
      {
        name: 'FCM Token Registration',
        test: async () => {
          const result = await registerToken();
          return result.success;
        },
      },
      {
        name: 'Message Listener',
        test: async () => {
          await startListening();
          return isListening;
        },
      },
      {
        name: 'Sound System',
        test: async () => {
          try {
            await testNotificationSound('medium');
            return true;
          } catch {
            return false;
          }
        },
      },
    ];

    for (const test of tests) {
      await runTest(test.name, test.test);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunningTests(false);
    toast.success('All tests completed!');
  };

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === undefined) return <TestTube className="w-5 h-5 text-gray-400" />;
    return status ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> : 
      <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (status: boolean | undefined) => {
    if (status === undefined) return 'border-gray-200';
    return status ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <TestTube className="w-8 h-8 mr-3" />
          Notification System Test
        </h1>
        <p className="text-gray-600">Test and validate the notification system functionality</p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">System Status</div>
              <div className={`font-semibold ${isInitialized ? 'text-green-600' : 'text-red-600'}`}>
                {isInitialized ? 'Initialized' : 'Not Initialized'}
              </div>
            </div>
            {isInitialized ? 
              <CheckCircle className="w-8 h-8 text-green-500" /> : 
              <XCircle className="w-8 h-8 text-red-500" />
            }
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">FCM Token</div>
              <div className={`font-semibold ${fcmToken ? 'text-green-600' : 'text-red-600'}`}>
                {fcmToken ? 'Available' : 'Not Available'}
              </div>
            </div>
            {fcmToken ? 
              <CheckCircle className="w-8 h-8 text-green-500" /> : 
              <XCircle className="w-8 h-8 text-red-500" />
            }
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Messages Received</div>
              <div className="font-semibold text-blue-600">{messageCount}</div>
            </div>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Unread Notifications</div>
              <div className="font-semibold text-orange-600">{unreadCount}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Test Results</h2>
          <button
            onClick={runAllTests}
            disabled={isRunningTests}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <TestTube className="w-4 h-4 mr-2" />
            {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Browser Support', description: 'Check if browser supports notifications' },
            { name: 'Notification Permission', description: 'Request and verify notification permissions' },
            { name: 'FCM Token Registration', description: 'Register FCM token with Firebase' },
            { name: 'Message Listener', description: 'Start listening for incoming messages' },
            { name: 'Sound System', description: 'Test notification sound playback' },
          ].map((test) => (
            <motion.div
              key={test.name}
              className={`border rounded-lg p-4 ${getStatusColor(testResults[test.name])}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-gray-600">{test.description}</div>
                </div>
                {getStatusIcon(testResults[test.name])}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Notification Context</h3>
            <div className="text-sm space-y-1">
              <div>Supported: {isSupported ? 'Yes' : 'No'}</div>
              <div>Initialized: {isInitialized ? 'Yes' : 'No'}</div>
              <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
              <div>Error: {error || 'None'}</div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Token Status</h3>
            <div className="text-sm space-y-1">
              <div>Registered: {isRegistered ? 'Yes' : 'No'}</div>
              <div>Registering: {isRegistering ? 'Yes' : 'No'}</div>
              <div>Token Error: {tokenError || 'None'}</div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Messaging</h3>
            <div className="text-sm space-y-1">
              <div>Listening: {isListening ? 'Yes' : 'No'}</div>
              <div>Messages: {messageCount}</div>
              <div>Last Message: {lastMessage ? 'Received' : 'None'}</div>
              <div>Error: {messagingError || 'None'}</div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Notification Stats</h3>
            <div className="text-sm space-y-1">
              <div>Total: {stats.total}</div>
              <div>Unread: {stats.unread}</div>
              <div>Critical: {stats.critical}</div>
              <div>High: {stats.high}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={initializeNotifications}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Initialize System
          </button>
          <button
            onClick={refreshToken}
            disabled={isRegistering}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Refresh Token
          </button>
          <button
            onClick={retryInitialization}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
          >
            Retry Initialization
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationTest;

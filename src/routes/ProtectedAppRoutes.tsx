// ProtectedLayout.tsx

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { decryptData } from '../utils/Secure';

export const ProtectedLayout = () => {
  const location = useLocation();
  const { data: authData, isLoading } = useAuth();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [fcmToken, _] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<string>('');

  useEffect(() => {
    if (!isLoading && !authData) {
      const path = location.pathname + location.search;
      setRedirectPath(`/auth-login?redirect=${encodeURIComponent(path)}`);
    }

    if (authData) {
      const validationKey = authData?.validationKey;
      const decrypt = decryptData(validationKey);

      if (decrypt !== 'WELCOMESUPERADMIN') {
        const path = location.pathname + location.search;
        setRedirectPath(`/auth-login?redirect=${encodeURIComponent(path)}`);
      } else {
        // Initialize FCM
      }
    }
  }, [isLoading, authData, location]);

  // Listen for foreground messages
  // useEffect(() => {
  //   const fcmToken = localStorage.getItem('fcmToken');

  //   if (fcmToken) {
  //     const unsubscribe = onMessageListener().then((message: any) => {
  //       console.log('Foreground Message Received:', message);
  //       toast.success(message?.data?.title);
  //     });
  //     return () => {
  //       // unsubscribe();
  //     };
  //   }
  // }, [fcmToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return authData ? <Outlet /> : null;
};

/**
 * Optimized Notifications Hook
 * Provides performance-optimized notification management with caching, debouncing, and lazy loading
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { NotificationMessage } from '../contexts/NotificationContext';
import { notificationPersistence } from '../utils/notificationPersistence';
import { notificationAnalytics } from '../utils/notificationAnalytics';

interface UseOptimizedNotificationsOptions {
  pageSize?: number;
  enableVirtualization?: boolean;
  cacheTimeout?: number;
  debounceMs?: number;
  enableAnalytics?: boolean;
}

interface OptimizedNotificationState {
  notifications: NotificationMessage[];
  totalCount: number;
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

export const useOptimizedNotifications = (options: UseOptimizedNotificationsOptions = {}) => {
  const {
    pageSize = 20,
    enableVirtualization = true,
    cacheTimeout = 5 * 60 * 1000, // 5 minutes
    debounceMs = 300,
    enableAnalytics = true
  } = options;

  const [currentPage, setCurrentPage] = useState(0);
  const [visibleNotifications, setVisibleNotifications] = useState<NotificationMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  
  const queryClient = useQueryClient();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  // Memoized filter function
  const filterNotifications = useMemo(() => {
    return (notifications: NotificationMessage[]) => {
      return notifications.filter(notification => {
        const matchesSearch = !searchQuery || 
          notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.body.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
        const matchesType = filterType === 'all' || notification.type === filterType;
        
        return matchesSearch && matchesPriority && matchesType;
      });
    };
  }, [searchQuery, filterPriority, filterType]);

  // Optimized query with caching
  const {
    data: notificationData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['optimized-notifications', currentPage, searchQuery, filterPriority, filterType],
    queryFn: async () => {
      // Get from persistence first (instant)
      const persistedNotifications = notificationPersistence.getNotifications();
      const filtered = filterNotifications(persistedNotifications);
      
      // Paginate results
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedNotifications = filtered.slice(startIndex, endIndex);
      
      return {
        notifications: paginatedNotifications,
        totalCount: filtered.length,
        unreadCount: filtered.filter(n => !n.isRead).length,
        hasMore: endIndex < filtered.length
      };
    },
    staleTime: cacheTimeout,
    gcTime: cacheTimeout * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setCurrentPage(0); // Reset to first page on search
    }, debounceMs),
    [debounceMs]
  );

  // Virtualization with Intersection Observer
  useEffect(() => {
    if (!enableVirtualization || !loadingRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && notificationData?.hasMore && !isLoading) {
          setCurrentPage(prev => prev + 1);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observerRef.current.observe(loadingRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableVirtualization, notificationData?.hasMore, isLoading]);

  // Update visible notifications with smooth transitions
  useEffect(() => {
    if (notificationData?.notifications) {
      if (currentPage === 0) {
        // Replace all notifications on first page or filter change
        setVisibleNotifications(notificationData.notifications);
      } else {
        // Append new notifications for pagination
        setVisibleNotifications(prev => [...prev, ...notificationData.notifications]);
      }
    }
  }, [notificationData, currentPage]);

  // Analytics tracking
  const trackNotificationAction = useCallback((
    notificationId: string,
    action: 'opened' | 'clicked' | 'dismissed'
  ) => {
    if (enableAnalytics) {
      notificationAnalytics.trackEvent(notificationId, action);
    }
  }, [enableAnalytics]);

  // Optimized mark as read with batching
  const markAsReadOptimized = useCallback((notificationId: string) => {
    // Optimistic update
    setVisibleNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );

    // Track analytics
    trackNotificationAction(notificationId, 'opened');

    // Persist change
    notificationPersistence.markAsRead(notificationId);

    // Invalidate cache
    queryClient.invalidateQueries({ queryKey: ['optimized-notifications'] });
  }, [trackNotificationAction, queryClient]);

  // Batch mark multiple as read
  const markMultipleAsRead = useCallback((notificationIds: string[]) => {
    // Optimistic update
    setVisibleNotifications(prev => 
      prev.map(notification => 
        notificationIds.includes(notification.id)
          ? { ...notification, isRead: true }
          : notification
      )
    );

    // Track analytics for each
    notificationIds.forEach(id => trackNotificationAction(id, 'opened'));

    // Batch persist changes
    notificationIds.forEach(id => notificationPersistence.markAsRead(id));

    // Invalidate cache
    queryClient.invalidateQueries({ queryKey: ['optimized-notifications'] });
  }, [trackNotificationAction, queryClient]);

  // Optimized dismiss with animation
  const dismissOptimized = useCallback((notificationId: string) => {
    // Optimistic update with fade out
    setVisibleNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );

    // Track analytics
    trackNotificationAction(notificationId, 'dismissed');

    // Persist change
    notificationPersistence.removeNotification(notificationId);

    // Invalidate cache
    queryClient.invalidateQueries({ queryKey: ['optimized-notifications'] });
  }, [trackNotificationAction, queryClient]);

  // Prefetch next page
  const prefetchNextPage = useCallback(() => {
    if (notificationData?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ['optimized-notifications', currentPage + 1, searchQuery, filterPriority, filterType],
        queryFn: async () => {
          const persistedNotifications = notificationPersistence.getNotifications();
          const filtered = filterNotifications(persistedNotifications);
          const startIndex = (currentPage + 1) * pageSize;
          const endIndex = startIndex + pageSize;
          
          return {
            notifications: filtered.slice(startIndex, endIndex),
            totalCount: filtered.length,
            unreadCount: filtered.filter(n => !n.isRead).length,
            hasMore: endIndex < filtered.length
          };
        },
        staleTime: cacheTimeout
      });
    }
  }, [notificationData?.hasMore, queryClient, currentPage, searchQuery, filterPriority, filterType, filterNotifications, pageSize, cacheTimeout]);

  // Auto-prefetch when near end of current page
  useEffect(() => {
    if (visibleNotifications.length > 0 && visibleNotifications.length >= pageSize * 0.8) {
      prefetchNextPage();
    }
  }, [visibleNotifications.length, pageSize, prefetchNextPage]);

  // Memoized state to prevent unnecessary re-renders
  const optimizedState: OptimizedNotificationState = useMemo(() => ({
    notifications: visibleNotifications,
    totalCount: notificationData?.totalCount || 0,
    unreadCount: notificationData?.unreadCount || 0,
    isLoading,
    hasMore: notificationData?.hasMore || false,
    error: error?.message || null
  }), [visibleNotifications, notificationData, isLoading, error]);

  // Memoized actions to prevent unnecessary re-renders
  const actions = useMemo(() => ({
    search: debouncedSearch,
    setFilterPriority: (priority: string) => {
      setFilterPriority(priority);
      setCurrentPage(0);
    },
    setFilterType: (type: string) => {
      setFilterType(type);
      setCurrentPage(0);
    },
    markAsRead: markAsReadOptimized,
    markMultipleAsRead,
    dismiss: dismissOptimized,
    refresh: refetch,
    loadMore: () => setCurrentPage(prev => prev + 1),
    reset: () => {
      setCurrentPage(0);
      setVisibleNotifications([]);
      setSearchQuery('');
      setFilterPriority('all');
      setFilterType('all');
    }
  }), [
    debouncedSearch,
    markAsReadOptimized,
    markMultipleAsRead,
    dismissOptimized,
    refetch
  ]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return {
    ...optimizedState,
    actions,
    loadingRef, // For intersection observer
    filters: {
      searchQuery,
      filterPriority,
      filterType
    }
  };
};

export default useOptimizedNotifications;

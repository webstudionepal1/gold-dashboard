/**
 * Notification Persistence Manager
 * Handles local storage of notifications for offline access and state persistence
 */

import { NotificationMessage } from '../contexts/NotificationContext';

export interface PersistedNotification extends NotificationMessage {
  expiresAt: number; // Timestamp when notification should be removed
  syncStatus: 'pending' | 'synced' | 'failed';
  retryCount: number;
}

export interface NotificationStorage {
  notifications: PersistedNotification[];
  lastSync: number;
  settings: {
    maxNotifications: number;
    retentionDays: number;
    autoCleanup: boolean;
  };
}

class NotificationPersistenceManager {
  private readonly STORAGE_KEY = 'gold-dashboard-notifications';
  private readonly MAX_NOTIFICATIONS = 100;
  private readonly RETENTION_DAYS = 30;
  private readonly MAX_RETRY_COUNT = 3;

  /**
   * Get all persisted notifications
   */
  public getNotifications(): PersistedNotification[] {
    try {
      const storage = this.getStorage();
      const now = Date.now();
      
      // Filter out expired notifications
      const validNotifications = storage.notifications.filter(
        notification => notification.expiresAt > now
      );

      // Update storage if we removed expired notifications
      if (validNotifications.length !== storage.notifications.length) {
        this.saveNotifications(validNotifications);
      }

      return validNotifications.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Failed to get persisted notifications:', error);
      return [];
    }
  }

  /**
   * Save a single notification
   */
  public saveNotification(notification: NotificationMessage): void {
    try {
      const persistedNotification: PersistedNotification = {
        ...notification,
        expiresAt: Date.now() + (this.RETENTION_DAYS * 24 * 60 * 60 * 1000),
        syncStatus: 'pending',
        retryCount: 0
      };

      const notifications = this.getNotifications();
      
      // Check if notification already exists (avoid duplicates)
      const existingIndex = notifications.findIndex(n => n.id === notification.id);
      
      if (existingIndex >= 0) {
        // Update existing notification
        notifications[existingIndex] = {
          ...notifications[existingIndex],
          ...persistedNotification,
          retryCount: notifications[existingIndex].retryCount // Preserve retry count
        };
      } else {
        // Add new notification
        notifications.unshift(persistedNotification);
      }

      // Limit number of stored notifications
      const limitedNotifications = notifications.slice(0, this.MAX_NOTIFICATIONS);
      
      this.saveNotifications(limitedNotifications);
    } catch (error) {
      console.error('Failed to save notification:', error);
    }
  }

  /**
   * Update notification status
   */
  public updateNotification(
    notificationId: string, 
    updates: Partial<PersistedNotification>
  ): void {
    try {
      const notifications = this.getNotifications();
      const index = notifications.findIndex(n => n.id === notificationId);
      
      if (index >= 0) {
        notifications[index] = { ...notifications[index], ...updates };
        this.saveNotifications(notifications);
      }
    } catch (error) {
      console.error('Failed to update notification:', error);
    }
  }

  /**
   * Mark notification as read
   */
  public markAsRead(notificationId: string): void {
    this.updateNotification(notificationId, { 
      isRead: true,
      syncStatus: 'pending'
    });
  }

  /**
   * Mark all notifications as read
   */
  public markAllAsRead(): void {
    try {
      const notifications = this.getNotifications();
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: true,
        syncStatus: 'pending' as const
      }));
      
      this.saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  /**
   * Remove notification
   */
  public removeNotification(notificationId: string): void {
    try {
      const notifications = this.getNotifications();
      const filteredNotifications = notifications.filter(n => n.id !== notificationId);
      this.saveNotifications(filteredNotifications);
    } catch (error) {
      console.error('Failed to remove notification:', error);
    }
  }

  /**
   * Clear all notifications
   */
  public clearAllNotifications(): void {
    try {
      this.saveNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  /**
   * Get notifications that need syncing
   */
  public getPendingSyncNotifications(): PersistedNotification[] {
    return this.getNotifications().filter(
      notification => notification.syncStatus === 'pending' && 
                    notification.retryCount < this.MAX_RETRY_COUNT
    );
  }

  /**
   * Mark notification as synced
   */
  public markAsSynced(notificationId: string): void {
    this.updateNotification(notificationId, { 
      syncStatus: 'synced',
      retryCount: 0
    });
  }

  /**
   * Mark notification sync as failed
   */
  public markSyncFailed(notificationId: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      const newRetryCount = notification.retryCount + 1;
      const syncStatus = newRetryCount >= this.MAX_RETRY_COUNT ? 'failed' : 'pending';
      
      this.updateNotification(notificationId, {
        syncStatus,
        retryCount: newRetryCount
      });
    }
  }

  /**
   * Get notification statistics
   */
  public getStats(): {
    total: number;
    unread: number;
    pending: number;
    failed: number;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
  } {
    const notifications = this.getNotifications();
    
    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      pending: notifications.filter(n => n.syncStatus === 'pending').length,
      failed: notifications.filter(n => n.syncStatus === 'failed').length,
      byPriority: {} as Record<string, number>,
      byType: {} as Record<string, number>
    };

    // Count by priority
    notifications.forEach(notification => {
      stats.byPriority[notification.priority] = 
        (stats.byPriority[notification.priority] || 0) + 1;
      stats.byType[notification.type] = 
        (stats.byType[notification.type] || 0) + 1;
    });

    return stats;
  }

  /**
   * Cleanup expired and old notifications
   */
  public cleanup(): void {
    try {
      const notifications = this.getNotifications();
      const now = Date.now();
      
      // Remove expired notifications and limit total count
      const cleanedNotifications = notifications
        .filter(notification => notification.expiresAt > now)
        .slice(0, this.MAX_NOTIFICATIONS);

      if (cleanedNotifications.length !== notifications.length) {
        this.saveNotifications(cleanedNotifications);
        console.log(`Cleaned up ${notifications.length - cleanedNotifications.length} notifications`);
      }
    } catch (error) {
      console.error('Failed to cleanup notifications:', error);
    }
  }

  /**
   * Export notifications for backup
   */
  public exportNotifications(): string {
    try {
      const storage = this.getStorage();
      return JSON.stringify(storage, null, 2);
    } catch (error) {
      console.error('Failed to export notifications:', error);
      return '{}';
    }
  }

  /**
   * Import notifications from backup
   */
  public importNotifications(data: string): boolean {
    try {
      const imported = JSON.parse(data) as NotificationStorage;
      
      // Validate structure
      if (!imported.notifications || !Array.isArray(imported.notifications)) {
        throw new Error('Invalid notification data structure');
      }

      // Merge with existing notifications (avoid duplicates)
      const existing = this.getNotifications();
      const existingIds = new Set(existing.map(n => n.id));
      
      const newNotifications = imported.notifications.filter(
        notification => !existingIds.has(notification.id)
      );

      const merged = [...existing, ...newNotifications]
        .slice(0, this.MAX_NOTIFICATIONS);

      this.saveNotifications(merged);
      return true;
    } catch (error) {
      console.error('Failed to import notifications:', error);
      return false;
    }
  }

  /**
   * Get storage object
   */
  private getStorage(): NotificationStorage {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse stored notifications:', error);
    }

    // Return default storage structure
    return {
      notifications: [],
      lastSync: 0,
      settings: {
        maxNotifications: this.MAX_NOTIFICATIONS,
        retentionDays: this.RETENTION_DAYS,
        autoCleanup: true
      }
    };
  }

  /**
   * Save notifications to storage
   */
  private saveNotifications(notifications: PersistedNotification[]): void {
    try {
      const storage = this.getStorage();
      storage.notifications = notifications;
      storage.lastSync = Date.now();
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.error('Failed to save notifications to storage:', error);
      
      // If storage is full, try to cleanup and retry
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.cleanup();
        try {
          const storage = this.getStorage();
          storage.notifications = notifications.slice(0, Math.floor(this.MAX_NOTIFICATIONS / 2));
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
        } catch (retryError) {
          console.error('Failed to save notifications after cleanup:', retryError);
        }
      }
    }
  }

  /**
   * Check if storage is available
   */
  public isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
export const notificationPersistence = new NotificationPersistenceManager();

export default notificationPersistence;

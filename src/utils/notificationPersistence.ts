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
  private readonly STORAGE_KEY = 'barungems_notifications';
  private readonly SETTINGS_KEY = 'barungems_notification_settings';
  private readonly MAX_NOTIFICATIONS = 100;
  private readonly RETENTION_DAYS = 30;

  /**
   * Get default storage structure
   */
  private getDefaultStorage(): NotificationStorage {
    return {
      notifications: [],
      lastSync: Date.now(),
      settings: {
        maxNotifications: this.MAX_NOTIFICATIONS,
        retentionDays: this.RETENTION_DAYS,
        autoCleanup: true,
      },
    };
  }

  /**
   * Get all notifications from storage
   */
  public getNotifications(): PersistedNotification[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const data: NotificationStorage = JSON.parse(stored);
      
      // Auto-cleanup if enabled
      if (data.settings?.autoCleanup) {
        return this.cleanupExpiredNotifications(data.notifications);
      }
      
      return data.notifications || [];
    } catch (error) {
      console.error('Failed to get notifications from storage:', error);
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
   * Save multiple notifications
   */
  public saveNotifications(notifications: PersistedNotification[]): void {
    try {
      const storage: NotificationStorage = {
        notifications,
        lastSync: Date.now(),
        settings: this.getSettings(),
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.error('Failed to save notifications:', error);
      
      // If storage is full, try to cleanup and retry
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.cleanup();
        try {
          const storage: NotificationStorage = {
            notifications: notifications.slice(0, Math.floor(this.MAX_NOTIFICATIONS / 2)),
            lastSync: Date.now(),
            settings: this.getSettings(),
          };
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
        } catch (retryError) {
          console.error('Failed to save notifications after cleanup:', retryError);
        }
      }
    }
  }

  /**
   * Update notification status
   */
  public updateNotificationStatus(
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
      console.error('Failed to update notification status:', error);
    }
  }

  /**
   * Mark notification as read
   */
  public markAsRead(notificationId: string): void {
    this.updateNotificationStatus(notificationId, { 
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
      const updatedNotifications = notifications.map(n => ({
        ...n,
        isRead: true,
        syncStatus: 'pending' as const
      }));
      this.saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  /**
   * Delete notification
   */
  public deleteNotification(notificationId: string): void {
    try {
      const notifications = this.getNotifications();
      const filteredNotifications = notifications.filter(n => n.id !== notificationId);
      this.saveNotifications(filteredNotifications);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }

  /**
   * Clear all notifications
   */
  public clearAll(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  /**
   * Get notifications by status
   */
  public getNotificationsByStatus(status: 'pending' | 'synced' | 'failed'): PersistedNotification[] {
    return this.getNotifications().filter(n => n.syncStatus === status);
  }

  /**
   * Get unread notifications
   */
  public getUnreadNotifications(): PersistedNotification[] {
    return this.getNotifications().filter(n => !n.isRead);
  }

  /**
   * Get notifications by priority
   */
  public getNotificationsByPriority(priority: NotificationMessage['priority']): PersistedNotification[] {
    return this.getNotifications().filter(n => n.priority === priority);
  }

  /**
   * Cleanup expired notifications
   */
  private cleanupExpiredNotifications(notifications: PersistedNotification[]): PersistedNotification[] {
    const now = Date.now();
    return notifications.filter(n => n.expiresAt > now);
  }

  /**
   * Manual cleanup
   */
  public cleanup(): void {
    try {
      const notifications = this.getNotifications();
      const cleanedNotifications = this.cleanupExpiredNotifications(notifications);
      
      // Also remove oldest notifications if we're over the limit
      const limitedNotifications = cleanedNotifications.slice(0, this.MAX_NOTIFICATIONS);
      
      this.saveNotifications(limitedNotifications);
      
      console.log(`Cleaned up ${notifications.length - limitedNotifications.length} notifications`);
    } catch (error) {
      console.error('Failed to cleanup notifications:', error);
    }
  }

  /**
   * Get storage settings
   */
  public getSettings(): NotificationStorage['settings'] {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to get notification settings:', error);
    }
    
    return this.getDefaultStorage().settings;
  }

  /**
   * Update storage settings
   */
  public updateSettings(settings: Partial<NotificationStorage['settings']>): void {
    try {
      const currentSettings = this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  }

  /**
   * Get storage statistics
   */
  public getStats(): {
    total: number;
    unread: number;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
    storageSize: number;
  } {
    try {
      const notifications = this.getNotifications();
      const storageData = localStorage.getItem(this.STORAGE_KEY);
      
      return {
        total: notifications.length,
        unread: notifications.filter(n => !n.isRead).length,
        byPriority: notifications.reduce((acc, n) => {
          acc[n.priority] = (acc[n.priority] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byStatus: notifications.reduce((acc, n) => {
          acc[n.syncStatus] = (acc[n.syncStatus] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        storageSize: storageData ? new Blob([storageData]).size : 0,
      };
    } catch (error) {
      console.error('Failed to get notification stats:', error);
      return {
        total: 0,
        unread: 0,
        byPriority: {},
        byStatus: {},
        storageSize: 0,
      };
    }
  }

  /**
   * Export notifications
   */
  public exportNotifications(): string {
    try {
      const data = {
        notifications: this.getNotifications(),
        settings: this.getSettings(),
        exportedAt: new Date().toISOString(),
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export notifications:', error);
      return '{}';
    }
  }

  /**
   * Import notifications
   */
  public importNotifications(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.notifications && Array.isArray(data.notifications)) {
        this.saveNotifications(data.notifications);
        if (data.settings) {
          this.updateSettings(data.settings);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import notifications:', error);
      return false;
    }
  }
}

// Create singleton instance
export const notificationPersistence = new NotificationPersistenceManager();

export default notificationPersistence;

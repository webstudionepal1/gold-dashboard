/**
 * Notification Analytics Manager
 * Tracks notification delivery, engagement, and performance metrics
 */

export interface NotificationEvent {
  id: string;
  notificationId: string;
  userId: string;
  eventType:
    | "sent"
    | "delivered"
    | "opened"
    | "clicked"
    | "dismissed"
    | "failed";
  timestamp: number;
  metadata?: {
    priority?: string;
    type?: string;
    source?: string;
    userAgent?: string;
    deviceType?: string;
    errorMessage?: string;
  };
}

export interface NotificationMetrics {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalDismissed: number;
  totalFailed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  dismissalRate: number;
  failureRate: number;
}

export interface AnalyticsReport {
  period: {
    start: number;
    end: number;
  };
  overall: NotificationMetrics;
  byPriority: Record<string, NotificationMetrics>;
  byType: Record<string, NotificationMetrics>;
  byHour: Record<string, number>;
  byDay: Record<string, number>;
  topPerformers: Array<{
    notificationId: string;
    title: string;
    openRate: number;
    clickRate: number;
  }>;
  trends: {
    deliveryTrend: number; // Percentage change from previous period
    engagementTrend: number;
    failureTrend: number;
  };
}

class NotificationAnalyticsManager {
  private readonly STORAGE_KEY = "notification-analytics";
  private readonly MAX_EVENTS = 10000;
  private events: NotificationEvent[] = [];

  constructor() {
    this.loadEvents();
  }

  /**
   * Track a notification event
   */
  public trackEvent(
    notificationId: string,
    eventType: NotificationEvent["eventType"],
    metadata?: NotificationEvent["metadata"]
  ): void {
    try {
      const event: NotificationEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        notificationId,
        userId: this.getCurrentUserId(),
        eventType,
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          userAgent: navigator.userAgent,
          deviceType: this.getDeviceType(),
        },
      };

      this.events.unshift(event);

      // Limit events to prevent storage overflow
      if (this.events.length > this.MAX_EVENTS) {
        this.events = this.events.slice(0, this.MAX_EVENTS);
      }

      this.saveEvents();

      // Send to backend analytics if available
      this.sendToBackend(event);
    } catch (error) {
      console.error("Failed to track notification event:", error);
    }
  }

  /**
   * Get analytics report for a specific period
   */
  public getReport(
    startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: Date = new Date()
  ): AnalyticsReport {
    const start = startDate.getTime();
    const end = endDate.getTime();

    const periodEvents = this.events.filter(
      (event) => event.timestamp >= start && event.timestamp <= end
    );

    const overall = this.calculateMetrics(periodEvents);
    const byPriority = this.calculateMetricsByField(periodEvents, "priority");
    const byType = this.calculateMetricsByField(periodEvents, "type");
    const byHour = this.calculateEventsByHour(periodEvents);
    const byDay = this.calculateEventsByDay(periodEvents);
    const topPerformers = this.calculateTopPerformers(periodEvents);
    const trends = this.calculateTrends(start, end);

    return {
      period: { start, end },
      overall,
      byPriority,
      byType,
      byHour,
      byDay,
      topPerformers,
      trends,
    };
  }

  /**
   * Get real-time metrics
   */
  public getRealTimeMetrics(): {
    activeNotifications: number;
    recentEvents: NotificationEvent[];
    currentHourEvents: number;
    errorRate: number;
  } {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const recentEvents = this.events.filter(
      (event) => event.timestamp >= oneHourAgo
    );

    const errorEvents = recentEvents.filter(
      (event) => event.eventType === "failed"
    );
    const errorRate =
      recentEvents.length > 0
        ? (errorEvents.length / recentEvents.length) * 100
        : 0;

    return {
      activeNotifications: this.getActiveNotificationCount(),
      recentEvents: this.events.slice(0, 10),
      currentHourEvents: recentEvents.length,
      errorRate,
    };
  }

  /**
   * Calculate metrics for a set of events
   */
  private calculateMetrics(events: NotificationEvent[]): NotificationMetrics {
    const sent = events.filter((e) => e.eventType === "sent").length;
    const delivered = events.filter((e) => e.eventType === "delivered").length;
    const opened = events.filter((e) => e.eventType === "opened").length;
    const clicked = events.filter((e) => e.eventType === "clicked").length;
    const dismissed = events.filter((e) => e.eventType === "dismissed").length;
    const failed = events.filter((e) => e.eventType === "failed").length;

    return {
      totalSent: sent,
      totalDelivered: delivered,
      totalOpened: opened,
      totalClicked: clicked,
      totalDismissed: dismissed,
      totalFailed: failed,
      deliveryRate: sent > 0 ? (delivered / sent) * 100 : 0,
      openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
      clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
      dismissalRate: delivered > 0 ? (dismissed / delivered) * 100 : 0,
      failureRate: sent > 0 ? (failed / sent) * 100 : 0,
    };
  }

  /**
   * Calculate metrics grouped by a metadata field
   */
  private calculateMetricsByField(
    events: NotificationEvent[],
    field: keyof NonNullable<NotificationEvent["metadata"]>
  ): Record<string, NotificationMetrics> {
    const grouped: Record<string, NotificationEvent[]> = {};

    events.forEach((event) => {
      const value = event.metadata?.[field] || "unknown";
      if (!grouped[value]) grouped[value] = [];
      grouped[value].push(event);
    });

    const result: Record<string, NotificationMetrics> = {};
    Object.entries(grouped).forEach(([key, groupEvents]) => {
      result[key] = this.calculateMetrics(groupEvents);
    });

    return result;
  }

  /**
   * Calculate events by hour of day
   */
  private calculateEventsByHour(
    events: NotificationEvent[]
  ): Record<string, number> {
    const byHour: Record<string, number> = {};

    for (let i = 0; i < 24; i++) {
      byHour[i.toString()] = 0;
    }

    events.forEach((event) => {
      const hour = new Date(event.timestamp).getHours();
      byHour[hour.toString()]++;
    });

    return byHour;
  }

  /**
   * Calculate events by day
   */
  private calculateEventsByDay(
    events: NotificationEvent[]
  ): Record<string, number> {
    const byDay: Record<string, number> = {};

    events.forEach((event) => {
      const date = new Date(event.timestamp).toISOString().split("T")[0];
      byDay[date] = (byDay[date] || 0) + 1;
    });

    return byDay;
  }

  /**
   * Calculate top performing notifications
   */
  private calculateTopPerformers(events: NotificationEvent[]): Array<{
    notificationId: string;
    title: string;
    openRate: number;
    clickRate: number;
  }> {
    const notificationGroups: Record<string, NotificationEvent[]> = {};

    events.forEach((event) => {
      if (!notificationGroups[event.notificationId]) {
        notificationGroups[event.notificationId] = [];
      }
      notificationGroups[event.notificationId].push(event);
    });

    const performers = Object.entries(notificationGroups).map(
      ([notificationId, notificationEvents]) => {
        const metrics = this.calculateMetrics(notificationEvents);
        return {
          notificationId,
          title: this.getNotificationTitle(notificationId),
          openRate: metrics.openRate,
          clickRate: metrics.clickRate,
        };
      }
    );

    return performers
      .sort((a, b) => b.openRate + b.clickRate - (a.openRate + a.clickRate))
      .slice(0, 10);
  }

  /**
   * Calculate trends compared to previous period
   */
  private calculateTrends(
    start: number,
    end: number
  ): AnalyticsReport["trends"] {
    const periodLength = end - start;
    const previousStart = start - periodLength;
    const previousEnd = start;

    const currentEvents = this.events.filter(
      (e) => e.timestamp >= start && e.timestamp <= end
    );
    const previousEvents = this.events.filter(
      (e) => e.timestamp >= previousStart && e.timestamp <= previousEnd
    );

    const currentMetrics = this.calculateMetrics(currentEvents);
    const previousMetrics = this.calculateMetrics(previousEvents);

    const calculateTrend = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      deliveryTrend: calculateTrend(
        currentMetrics.deliveryRate,
        previousMetrics.deliveryRate
      ),
      engagementTrend: calculateTrend(
        currentMetrics.openRate + currentMetrics.clickRate,
        previousMetrics.openRate + previousMetrics.clickRate
      ),
      failureTrend: calculateTrend(
        currentMetrics.failureRate,
        previousMetrics.failureRate
      ),
    };
  }

  /**
   * Get current user ID
   */
  private getCurrentUserId(): string {
    try {
      const authData = localStorage.getItem("auth-user");
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.id || "anonymous";
      }
    } catch (error) {
      console.warn("Failed to get user ID for analytics:", error);
    }
    return "anonymous";
  }

  /**
   * Get device type
   */
  private getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      return "mobile";
    } else if (/tablet|ipad/i.test(userAgent)) {
      return "tablet";
    } else {
      return "desktop";
    }
  }

  /**
   * Get notification title by ID
   */
  private getNotificationTitle(notificationId: string): string {
    // In a real implementation, this would fetch from a notification store
    return `Notification ${notificationId.substring(0, 8)}`;
  }

  /**
   * Get count of active notifications
   */
  private getActiveNotificationCount(): number {
    // This would typically come from the notification context
    return 0;
  }

  /**
   * Send event to backend analytics
   */
  private async sendToBackend(event: NotificationEvent): Promise<void> {
    try {
      // Only send in production or when analytics endpoint is available
      if (process.env.NODE_ENV === "development") {
        return;
      }

      // Implementation would send to analytics API
      // await apiClient.post('/analytics/notification-events', event);
    } catch (error) {
      console.warn("Failed to send analytics event to backend:", error);
    }
  }

  /**
   * Load events from storage
   */
  private loadEvents(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load analytics events:", error);
      this.events = [];
    }
  }

  /**
   * Save events to storage
   */
  private saveEvents(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.error("Failed to save analytics events:", error);

      // If storage is full, remove old events and retry
      if (error instanceof Error && error.name === "QuotaExceededError") {
        this.events = this.events.slice(0, Math.floor(this.MAX_EVENTS / 2));
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
        } catch (retryError) {
          console.error(
            "Failed to save analytics events after cleanup:",
            retryError
          );
        }
      }
    }
  }

  /**
   * Clear all analytics data
   */
  public clearAnalytics(): void {
    this.events = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Export analytics data
   */
  public exportAnalytics(): string {
    return JSON.stringify(
      {
        events: this.events,
        exportDate: new Date().toISOString(),
        version: "1.0",
      },
      null,
      2
    );
  }
}

// Create singleton instance
export const notificationAnalytics = new NotificationAnalyticsManager();

// Convenience functions
export const trackNotificationSent = (
  notificationId: string,
  metadata?: NotificationEvent["metadata"]
) => notificationAnalytics.trackEvent(notificationId, "sent", metadata);

export const trackNotificationDelivered = (
  notificationId: string,
  metadata?: NotificationEvent["metadata"]
) => notificationAnalytics.trackEvent(notificationId, "delivered", metadata);

export const trackNotificationOpened = (
  notificationId: string,
  metadata?: NotificationEvent["metadata"]
) => notificationAnalytics.trackEvent(notificationId, "opened", metadata);

export const trackNotificationClicked = (
  notificationId: string,
  metadata?: NotificationEvent["metadata"]
) => notificationAnalytics.trackEvent(notificationId, "clicked", metadata);

export const trackNotificationDismissed = (
  notificationId: string,
  metadata?: NotificationEvent["metadata"]
) => notificationAnalytics.trackEvent(notificationId, "dismissed", metadata);

export const trackNotificationFailed = (
  notificationId: string,
  metadata?: NotificationEvent["metadata"]
) => notificationAnalytics.trackEvent(notificationId, "failed", metadata);

export default notificationAnalytics;

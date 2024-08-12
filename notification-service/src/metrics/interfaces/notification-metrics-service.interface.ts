export const NOTIFICATION_METRICS_SERVICE = 'NotificationMetricsService';

export interface INotificationMetricsService {
  incRateEmailSentCounter(): void;
  incRateEmailFailedCounter(): void;
}

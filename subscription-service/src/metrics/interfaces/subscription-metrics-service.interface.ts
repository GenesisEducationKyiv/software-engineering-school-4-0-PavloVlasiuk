export const SUBSCRIPTION_METRICS_SERVICE = 'SubscriptionCreatedMetrics';

export interface ISubscriptionMetricsService {
  incSubscriptionCreatedCounter(): void;
  incSubscriptionDeletedCounter(): void;
}

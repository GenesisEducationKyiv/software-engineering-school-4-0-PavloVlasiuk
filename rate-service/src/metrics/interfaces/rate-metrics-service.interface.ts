export const RATE_METRICS_SERVICE = 'RateMetricsService';

export interface IRateMetricsService {
  incRateFetchedCounter(): void;
  incRateFetchingFailedCounter(): void;
}

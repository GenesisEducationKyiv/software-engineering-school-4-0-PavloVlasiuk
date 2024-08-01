export const METRICS_SERVICE = 'MetricsService';

export interface IMetricsService {
  getMetrics(): Promise<string>;
}

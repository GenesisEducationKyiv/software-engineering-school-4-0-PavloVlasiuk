import { Provider } from '@nestjs/common';

import { METRICS_SERVICE } from './interfaces';
import { SUBSCRIPTION_METRICS_SERVICE } from './interfaces/subscription-metrics-service.interface';
import { MetricsService, SubscriptionMetricsService } from './services';

const metricsService: Provider = {
  provide: METRICS_SERVICE,
  useClass: MetricsService,
};

const subscriptionMetricsService: Provider = {
  provide: SUBSCRIPTION_METRICS_SERVICE,
  useClass: SubscriptionMetricsService,
};

export const metricsProviders = [metricsService, subscriptionMetricsService];

import { Provider } from '@nestjs/common';

import { METRICS_SERVICE, NOTIFICATION_METRICS_SERVICE } from './interfaces';
import { MetricsService, NotificationMetricsService } from './services';

const metricsService: Provider = {
  provide: METRICS_SERVICE,
  useClass: MetricsService,
};

const notificationMetricsService: Provider = {
  provide: NOTIFICATION_METRICS_SERVICE,
  useClass: NotificationMetricsService,
};

export const metricsProviders = [metricsService, notificationMetricsService];

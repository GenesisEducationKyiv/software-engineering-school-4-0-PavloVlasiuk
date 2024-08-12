import { Provider } from '@nestjs/common';

import { METRICS_SERVICE, RATE_METRICS_SERVICE } from './interfaces';
import { MetricsService, RateMetricsService } from './services';

const metricsService: Provider = {
  provide: METRICS_SERVICE,
  useClass: MetricsService,
};

const rateMetricsService: Provider = {
  provide: RATE_METRICS_SERVICE,
  useClass: RateMetricsService,
};

export const metricsProviders = [metricsService, rateMetricsService];

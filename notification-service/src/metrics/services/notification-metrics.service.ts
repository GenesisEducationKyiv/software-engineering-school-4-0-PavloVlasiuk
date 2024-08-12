import { Injectable } from '@nestjs/common';
import { Counter } from 'prom-client';

import { MetricsService } from './metrics.service';
import { INotificationMetricsService } from '../interfaces';
import { METRICS } from '../metrics.constants';

@Injectable()
export class NotificationMetricsService
  extends MetricsService
  implements INotificationMetricsService
{
  private readonly rateEmailSentCounter: Counter<string>;

  private readonly rateEmailFailedCounter: Counter<string>;

  constructor() {
    super();

    this.rateEmailSentCounter = this.createCounter(
      METRICS.COUNTERS.RATE_EMAIL_SENT.NAME,
      METRICS.COUNTERS.RATE_EMAIL_SENT.HELP,
    );

    this.rateEmailFailedCounter = this.createCounter(
      METRICS.COUNTERS.RATE_EMAIL_FAILED.NAME,
      METRICS.COUNTERS.RATE_EMAIL_FAILED.HELP,
    );
  }

  incRateEmailSentCounter(): void {
    this.rateEmailSentCounter.inc();
  }

  incRateEmailFailedCounter(): void {
    this.rateEmailFailedCounter.inc();
  }
}

import { Injectable } from '@nestjs/common';
import { Counter } from 'prom-client';

import { MetricsService } from './metrics.service';
import { ISubscriptionMetricsService } from '../interfaces';
import { METRICS } from '../metrics.constants';

@Injectable()
export class SubscriptionMetricsService
  extends MetricsService
  implements ISubscriptionMetricsService
{
  private readonly subscriptionCreatedCounter: Counter<string>;

  private readonly subscriptionDeleteCounter: Counter<string>;

  constructor() {
    super();

    this.subscriptionCreatedCounter = this.createCounter(
      METRICS.COUNTERS.SUBSCRIPTION_CREATED.NAME,
      METRICS.COUNTERS.SUBSCRIPTION_CREATED.HELP,
    );

    this.subscriptionDeleteCounter = this.createCounter(
      METRICS.COUNTERS.SUBSCRIPTION_DELETED.NAME,
      METRICS.COUNTERS.SUBSCRIPTION_DELETED.HELP,
    );
  }

  incSubscriptionCreatedCounter(): void {
    console.log('metric');
    this.subscriptionCreatedCounter.inc();
  }

  incSubscriptionDeletedCounter(): void {
    this.subscriptionDeleteCounter.inc();
  }
}

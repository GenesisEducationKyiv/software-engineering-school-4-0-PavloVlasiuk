import { Injectable } from '@nestjs/common';
import { Counter } from 'prom-client';

import { MetricsService } from './metrics.service';
import { IRateMetricsService } from '../interfaces';
import { METRICS } from '../metrics.constants';

@Injectable()
export class RateMetricsService
  extends MetricsService
  implements IRateMetricsService
{
  private readonly rateFetchedCounter: Counter<string>;

  private readonly rateFetchingFailedCounter: Counter<string>;

  constructor() {
    super();

    this.rateFetchedCounter = this.createCounter(
      METRICS.COUNTERS.RATE_FETCHED.NAME,
      METRICS.COUNTERS.RATE_FETCHED.HELP,
    );

    this.rateFetchingFailedCounter = this.createCounter(
      METRICS.COUNTERS.RATE_FETCHING_FAILED.NAME,
      METRICS.COUNTERS.RATE_FETCHING_FAILED.HELP,
    );
  }

  incRateFetchedCounter(): void {
    this.rateFetchedCounter.inc();
  }

  incRateFetchingFailedCounter(): void {
    this.rateFetchingFailedCounter.inc();
  }
}

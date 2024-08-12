import { Injectable } from '@nestjs/common';
import { Counter, register } from 'prom-client';

import { IMetricsService } from '../interfaces';

@Injectable()
export class MetricsService implements IMetricsService {
  getMetrics(): Promise<string> {
    return register.metrics();
  }

  protected createCounter(name: string, help: string): Counter<string> {
    return new Counter({
      name,
      help,
    });
  }
}

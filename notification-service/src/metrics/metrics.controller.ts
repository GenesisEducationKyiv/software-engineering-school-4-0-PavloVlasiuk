import { Controller, Get, Inject } from '@nestjs/common';

import { IMetricsService, METRICS_SERVICE } from './interfaces';

@Controller('metrics')
export class MetricsController {
  constructor(
    @Inject(METRICS_SERVICE)
    private readonly metricsService: IMetricsService,
  ) {}

  @Get()
  async get(): Promise<string> {
    return await this.metricsService.getMetrics();
  }
}

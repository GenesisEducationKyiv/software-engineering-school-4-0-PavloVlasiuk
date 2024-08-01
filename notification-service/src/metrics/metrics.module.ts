import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { MetricsController } from './metrics.controller';
import { metricsProviders } from './metrics.providers';

@Module({
  imports: [PrometheusModule.register()],
  controllers: [MetricsController],
  providers: [...metricsProviders],
  exports: [...metricsProviders],
})
export class MetricsModule {}

import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { RateResponseDto } from './dto/responses';
import {
  IExchangeRate,
  IRateClient,
  RATE_CLIENT,
  IRateService,
} from './interfaces';
import {
  IRateMetricsService,
  RATE_METRICS_SERVICE,
} from '../metrics/interfaces';

@Injectable()
export class RateService implements IRateService {
  constructor(
    @Inject(RATE_CLIENT)
    private readonly rateClient: IRateClient,
    @InjectPinoLogger(RateService.name)
    private readonly logger: PinoLogger,
    @Inject(RATE_METRICS_SERVICE)
    private readonly metricsService: IRateMetricsService,
  ) {}

  async getCurrentRate(): Promise<IExchangeRate> {
    try {
      const rate = await this.rateClient.getRate();

      this.metricsService.incRateFetchedCounter();

      return new RateResponseDto(rate);
    } catch (error) {
      this.logger.error(`Failed to fetch exchange rate: ${error}`);

      this.metricsService.incRateFetchingFailedCounter();

      throw error;
    }
  }
}

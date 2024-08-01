import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { RateResponseDto } from './dto/responses';
import {
  IExchangeRate,
  IRateClient,
  RATE_CLIENT,
  IRateService,
} from './interfaces';

@Injectable()
export class RateService implements IRateService {
  constructor(
    @Inject(RATE_CLIENT)
    private readonly rateClient: IRateClient,
    @InjectPinoLogger(RateService.name)
    private readonly logger: PinoLogger,
  ) {}

  async getCurrentRate(): Promise<IExchangeRate> {
    try {
      const rate = await this.rateClient.getRate();

      return new RateResponseDto(rate);
    } catch (error) {
      this.logger.error(`Failed to fetch exchange rate: ${error}`);

      throw error;
    }
  }
}

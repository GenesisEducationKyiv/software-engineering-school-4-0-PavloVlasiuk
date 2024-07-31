import { Inject, Injectable } from '@nestjs/common';

import { RateResponseDto } from './dtos/responses';
import {
  IExchangeRate,
  IRateClient,
  RATE_CLIENT,
  IRateService,
} from './interfaces';

@Injectable()
export class RateService implements IRateService {
  constructor(@Inject(RATE_CLIENT) private readonly rateClient: IRateClient) {}

  async getCurrentRate(): Promise<IExchangeRate> {
    const rate = await this.rateClient.getRate();

    return new RateResponseDto(rate);
  }
}

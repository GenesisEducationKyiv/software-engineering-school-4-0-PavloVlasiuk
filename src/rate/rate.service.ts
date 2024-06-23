import { Inject, Injectable } from '@nestjs/common';

import { RateResponseDto } from './dtos/responses/rate.response.dto';
import { IExchangeRate } from './interfaces';
import {
  IRateClient,
  RATE_CLIENT_TOKEN,
} from './interfaces/rate-client.interface';

@Injectable()
export class RateService {
  constructor(
    @Inject(RATE_CLIENT_TOKEN) private readonly rateClient: IRateClient,
  ) {}

  async getCurrentRate(): Promise<IExchangeRate> {
    const rate = await this.rateClient.getRate();

    return new RateResponseDto(rate);
  }
}

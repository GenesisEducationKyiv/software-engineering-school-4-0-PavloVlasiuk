import { Controller, Get } from '@nestjs/common';

import { IExchangeRate } from './interfaces';
import { RateService } from './rate.service';

@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getCurrentRate(): Promise<IExchangeRate> {
    return await this.rateService.getCurrentRate();
  }
}

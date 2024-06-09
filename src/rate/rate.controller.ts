import { Controller, Get } from '@nestjs/common';
import { RateService } from './rate.service';
import { CurrentRateResponse } from './responses/current-rate.response';

@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getCurrentRate(): Promise<CurrentRateResponse> {
    return await this.rateService.getCurrentRate();
  }
}

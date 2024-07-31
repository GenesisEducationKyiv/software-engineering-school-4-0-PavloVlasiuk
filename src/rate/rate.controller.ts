import { Controller, Get, Inject } from '@nestjs/common';

import { RateResponseDto } from './dtos/responses/rate.response.dto';
import { IRateService, RATE_SERVICE } from './interfaces';

@Controller('rate')
export class RateController {
  constructor(
    @Inject(RATE_SERVICE)
    private readonly rateService: IRateService,
  ) {}

  @Get()
  async getCurrentRate(): Promise<RateResponseDto> {
    return await this.rateService.getCurrentRate();
  }
}

import { Controller, Get } from '@nestjs/common';

import { RateResponseDto } from './dtos/responses/rate.response.dto';
import { RateService } from './rate.service';

@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getCurrentRate(): Promise<RateResponseDto> {
    return await this.rateService.getCurrentRate();
  }
}

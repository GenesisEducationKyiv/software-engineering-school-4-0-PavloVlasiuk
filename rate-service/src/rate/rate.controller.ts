import { Controller, Inject } from '@nestjs/common';

import { RateResponseDto } from './dto/responses/rate.response.dto';
import { IRateService, RATE_SERVICE } from './interfaces';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('rate')
export class RateController {
  constructor(
    @Inject(RATE_SERVICE)
    private readonly rateService: IRateService,
  ) {}

  @GrpcMethod('RateService')
  async getCurrentRate(): Promise<RateResponseDto> {
    return await this.rateService.getCurrentRate();
  }
}

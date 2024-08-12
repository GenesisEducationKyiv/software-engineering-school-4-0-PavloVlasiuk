import { Controller, Inject } from '@nestjs/common';
import {
  Rate,
  RateServiceController,
  RateServiceControllerMethods,
} from '@usd-to-uah-rate-api/proto/dist/rate';

import { IRateService, RATE_SERVICE } from './interfaces';

@Controller()
@RateServiceControllerMethods()
export class RateController implements RateServiceController {
  constructor(
    @Inject(RATE_SERVICE)
    private readonly rateService: IRateService,
  ) {}

  async getCurrentRate(): Promise<Rate> {
    return await this.rateService.getCurrentRate();
  }
}

import { Inject } from '@nestjs/common';

import { IRateService, RATE_SERVICE } from './interfaces';
import {
  Rate,
  RateServiceController,
  RateServiceControllerMethods,
} from '../../../proto/dist/types/rate';

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

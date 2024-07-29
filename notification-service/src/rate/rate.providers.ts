import { Provider } from '@nestjs/common';

import { RATE_SERVICE } from './interfaces';
import { RateService } from './rate.service';

const rateService: Provider = {
  provide: RATE_SERVICE,
  useClass: RateService,
};

export const rateProviders = [rateService];

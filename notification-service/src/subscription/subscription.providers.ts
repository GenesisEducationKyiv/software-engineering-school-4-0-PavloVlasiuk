import { Provider } from '@nestjs/common';

import { SUBSCRIPTION_SERVICE } from './interfaces';
import { SubscriptionService } from './subscription.service';

const subscriptionService: Provider = {
  provide: SUBSCRIPTION_SERVICE,
  useClass: SubscriptionService,
};

export const subscriptionProviders = [subscriptionService];

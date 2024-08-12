import { Provider } from '@nestjs/common';

import { SUBSCRIPTION_REPOSITORY, SUBSCRIPTION_SERVICE } from './interfaces';
import { SubscriptionRepository } from './repositories';
import { CreateSubscriptionSaga } from './sagas/create-subscription';
import { DeleteSubscriptionSaga } from './sagas/delete-subscription';
import { SAGAS } from './subscription.constants';
import { SubscriptionService } from './subscription.service';

const subscriptionRepository: Provider = {
  provide: SUBSCRIPTION_REPOSITORY,
  useClass: SubscriptionRepository,
};

const subscriptionService: Provider = {
  provide: SUBSCRIPTION_SERVICE,
  useClass: SubscriptionService,
};

const createSubscriptionSaga: Provider = {
  provide: SAGAS.CREATE_SUBSCRIPTION,
  useClass: CreateSubscriptionSaga,
};

const deleteSubscriptionSaga: Provider = {
  provide: SAGAS.DELETE_SUBSCRIPTION,
  useClass: DeleteSubscriptionSaga,
};

export const subscriptionProviders = [
  subscriptionRepository,
  subscriptionService,
  createSubscriptionSaga,
  deleteSubscriptionSaga,
];

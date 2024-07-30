import { Controller, Inject } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

import {
  SubscribeEmailRequestDto,
  UnsubscribeEmailRequestDto,
} from './dto/requests';
import { SubscribersResponse } from './dto/responses';
import { Subscription } from './entities';
import { ISubscriptionService, SUBSCRIPTION_SERVICE } from './interfaces';
import { ISaga } from './sagas/interfaces';
import { SAGAS } from './subscription.constants';
import {
  Subscribers,
  SubscriptionServiceController,
  SubscriptionServiceControllerMethods,
} from '../../../proto/dist/types/subscription';

@Controller()
@SubscriptionServiceControllerMethods()
export class SubscriptionController implements SubscriptionServiceController {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
    @Inject(SAGAS.CREATE_SUBSCRIPTION)
    private readonly createSubscriptionSaga: ISaga<Partial<Subscription>>,
    @Inject(SAGAS.DELETE_SUBSCRIPTION)
    private readonly deleteSubscriptionSaga: ISaga<Partial<Subscription>>,
  ) {}

  async subscribe(
    @Payload() subscribeEmailDto: SubscribeEmailRequestDto,
  ): Promise<void> {
    return await this.createSubscriptionSaga.start(subscribeEmailDto);
  }

  async getAllSubscribers(): Promise<Subscribers> {
    const subscribers = await this.subscriptionService.getAllSubscribers();

    return new SubscribersResponse(subscribers);
  }

  async unsubscribe(
    @Payload() unsubscribeEmailDto: UnsubscribeEmailRequestDto,
  ): Promise<void> {
    return await this.deleteSubscriptionSaga.start(unsubscribeEmailDto);
  }
}

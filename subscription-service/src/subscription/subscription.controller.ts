import { Inject } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

import {
  SubscribeEmailRequestDto,
  UnsubscribeEmailRequestDto,
} from './dto/requests';
import { SubscribersResponse } from './dto/responses';
import { ISubscriptionService, SUBSCRIPTION_SERVICE } from './interfaces';
import {
  Subscribers,
  SubscriptionServiceController,
  SubscriptionServiceControllerMethods,
} from '../../../proto/dist/types/subscription';

@SubscriptionServiceControllerMethods()
export class SubscriptionController implements SubscriptionServiceController {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  async subscribe(
    @Payload() subscribeEmailDto: SubscribeEmailRequestDto,
  ): Promise<void> {
    return await this.subscriptionService.subscribe(subscribeEmailDto);
  }

  async getAllSubscribers(): Promise<Subscribers> {
    const subscribers = await this.subscriptionService.getAllSubscribers();

    return new SubscribersResponse(subscribers);
  }

  async unsubscribe(
    @Payload() unsubscribeEmailDto: UnsubscribeEmailRequestDto,
  ): Promise<void> {
    return await this.subscriptionService.unsubscribe(unsubscribeEmailDto);
  }
}

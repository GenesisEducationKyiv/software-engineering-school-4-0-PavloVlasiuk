import { Inject } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { SubscribeEmailRequestDto } from './dto/requests';
import { SubscribersResponse } from './dto/responses';
import { ISubscriptionService, SUBSCRIPTION_SERVICE } from './interfaces';
import {
  Empty,
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

  subscribe(
    @Payload() subscribeEmailDto: SubscribeEmailRequestDto,
  ): Empty | Promise<Empty> | Observable<Empty> {
    return this.subscriptionService.subscribe(subscribeEmailDto);
  }

  async getAllSubscribers(): Promise<Subscribers> {
    const subscribers = await this.subscriptionService.getAllSubscribers();

    return new SubscribersResponse(subscribers);
  }
}

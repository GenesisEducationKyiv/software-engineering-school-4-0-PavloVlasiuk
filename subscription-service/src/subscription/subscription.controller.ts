import { Inject } from '@nestjs/common';
import { ISubscriptionService, SUBSCRIPTION_SERVICE } from './interfaces';
import { Payload } from '@nestjs/microservices';
import { SubscribeEmailRequestDto } from './dto/requests';
import { SubscribersResponse } from './dto/responses';
import {
  Empty,
  Subscribers,
  SubscriptionServiceController,
  SubscriptionServiceControllerMethods,
} from '../../../proto/dist/types/subscription';
import { Observable } from 'rxjs';

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

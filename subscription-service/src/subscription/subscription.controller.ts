import { Controller, Inject } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

import {
  SubscribeEmailRequestDto,
  UnsubscribeEmailRequestDto,
} from './dto/requests';
import { SubscribersResponse } from './dto/responses';
import { ISubscriptionService, SUBSCRIPTION_SERVICE } from './interfaces';
import { CreateSubscriptionSaga } from './sagas/create-subscription';
import { DeleteSubscriptionSaga } from './sagas/delete-subscription';
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
    private readonly createSubscriptionSaga: CreateSubscriptionSaga,
    private readonly deleteSubscriptionSaga: DeleteSubscriptionSaga,
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

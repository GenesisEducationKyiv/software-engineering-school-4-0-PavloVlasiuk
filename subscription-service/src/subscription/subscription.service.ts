import { Inject, Injectable } from '@nestjs/common';

import {
  SubscribeEmailRequestDto,
  UnsubscribeEmailRequestDto,
} from './dto/requests';
import { Subscription } from './entities';
import {
  AlreadySubscribedException,
  EntityNotFoundException,
} from './exceptions';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
  ISubscriptionService,
} from './interfaces';
import { CreateSubscriptionSaga } from './sagas/create-subscription';
import { DeleteSubscriptionSaga } from './sagas/delete-subscription';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly createSubscriptionSaga: CreateSubscriptionSaga,
    private readonly deleteSubscriptionSaga: DeleteSubscriptionSaga,
  ) {}

  async subscribe(data: SubscribeEmailRequestDto): Promise<void> {
    const { email } = data;

    const alreadySubscribed =
      await this.subscriptionRepository.findByEmail(email);

    if (alreadySubscribed) throw new AlreadySubscribedException();

    return this.createSubscriptionSaga.start(data);
  }

  async getAllSubscribers(): Promise<Subscription[]> {
    return this.subscriptionRepository.findAll();
  }

  async unsubscribe(data: UnsubscribeEmailRequestDto): Promise<void> {
    const { email } = data;

    const isSubscribed = await this.isSubscribed(email);

    if (!isSubscribed) throw new EntityNotFoundException('Subscription');

    return this.deleteSubscriptionSaga.start(data);
  }

  private async isSubscribed(email: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findByEmail(email);
  }
}

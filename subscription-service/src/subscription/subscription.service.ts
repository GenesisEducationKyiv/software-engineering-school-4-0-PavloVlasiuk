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

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async subscribe({ email }: SubscribeEmailRequestDto): Promise<void> {
    const alreadySubscribed = await this.isSubscribed(email);

    if (alreadySubscribed) throw new AlreadySubscribedException();

    await this.subscriptionRepository.createOrUpdate(email);
  }

  async getAllSubscribers(): Promise<Subscription[]> {
    return this.subscriptionRepository.findAll();
  }

  async unsubscribe({ email }: UnsubscribeEmailRequestDto): Promise<void> {
    const isSubscribed = await this.isSubscribed(email);

    if (!isSubscribed) throw new EntityNotFoundException('Subscription');

    await this.subscriptionRepository.deleteByEmail(email);
  }

  private async isSubscribed(email: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findByEmail(email);
  }
}

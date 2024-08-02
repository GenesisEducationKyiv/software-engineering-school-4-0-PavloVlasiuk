import { Inject, Injectable } from '@nestjs/common';

import { SubscribeEmailRequestDto } from './dto/requests';
import { Subscription } from './entities';
import { AlreadySubscribedException } from './exceptions';
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
    const alreadySubscribed =
      await this.subscriptionRepository.findByEmail(email);

    if (alreadySubscribed) throw new AlreadySubscribedException();

    await this.subscriptionRepository.create(email);
  }

  async getAllSubscribers(): Promise<Subscription[]> {
    return this.subscriptionRepository.findAll();
  }
}

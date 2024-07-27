import { Inject, Injectable } from '@nestjs/common';

import { Subscription } from '../../../entities';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../interfaces';
import { IStep } from '../../interfaces';

@Injectable()
export class CreateLocalSubscriptionStep
  implements IStep<Partial<Subscription>>
{
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute({ email }: Partial<Subscription>): Promise<void> {
    console.log('Local transaction');

    await this.subscriptionRepository.createOrUpdate(email);
  }

  async compensate({ email }: Partial<Subscription>): Promise<void> {
    console.log('Local compensate transaction');

    await this.subscriptionRepository.deleteByEmail(email);
  }
}

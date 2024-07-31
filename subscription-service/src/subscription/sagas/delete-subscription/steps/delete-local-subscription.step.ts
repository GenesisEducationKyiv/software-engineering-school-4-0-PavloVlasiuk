import { Inject, Injectable } from '@nestjs/common';

import { Subscription } from '../../../entities';
import {
  ISubscriptionService,
  SUBSCRIPTION_SERVICE,
} from '../../../interfaces';
import { IStep } from '../../interfaces';

@Injectable()
export class DeleteLocalSubscriptionStep
  implements IStep<Partial<Subscription>>
{
  constructor(
    @Inject(SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  async execute({ email }: Partial<Subscription>): Promise<void> {
    console.log('Local transaction');

    await this.subscriptionService.unsubscribe({ email });
  }

  async compensate({ email }: Partial<Subscription>): Promise<void> {
    console.log('Local compensate transaction');

    await this.subscriptionService.subscribe({ email });
  }
}

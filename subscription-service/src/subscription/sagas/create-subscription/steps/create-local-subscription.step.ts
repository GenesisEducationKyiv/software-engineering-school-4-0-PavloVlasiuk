import { Inject, Injectable } from '@nestjs/common';

import { Subscription } from '../../../entities';
import {
  ISubscriptionService,
  SUBSCRIPTION_SERVICE,
} from '../../../interfaces';
import { IStep } from '../../interfaces';

@Injectable()
export class CreateLocalSubscriptionStep
  implements IStep<Partial<Subscription>>
{
  constructor(
    @Inject(SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  async execute({ email }: Partial<Subscription>): Promise<void> {
    await this.subscriptionService.subscribe({ email });
  }

  async compensate({ email }: Partial<Subscription>): Promise<void> {
    await this.subscriptionService.unsubscribe({ email });
  }
}

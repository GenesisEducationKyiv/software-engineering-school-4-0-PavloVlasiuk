import { Injectable } from '@nestjs/common';

import {
  DeleteLocalSubscriptionStep,
  DeleteNotificationDBSubscriptionStep,
} from './steps';
import { Subscription } from '../../../subscription/entities';
import { IStep } from '../interfaces';

@Injectable()
export class DeleteSubscriptionSaga {
  private steps: IStep<Partial<Subscription>>[] = [];

  constructor(
    private readonly step1: DeleteLocalSubscriptionStep,
    private readonly step2: DeleteNotificationDBSubscriptionStep,
  ) {
    this.steps = [step1, step2];
  }

  async start(subscription: Partial<Subscription>): Promise<void> {
    const successfulSteps: IStep<Partial<Subscription>>[] = [];

    console.log('\nStarting delete subscription saga...');

    for (const step of this.steps) {
      try {
        await step.execute(subscription);

        successfulSteps.unshift(step);
      } catch (error) {
        console.log(error);

        if (!successfulSteps.length) throw error;

        for (const successfulStep of successfulSteps) {
          await successfulStep.compensate(subscription);
        }

        throw error;
      }
    }

    console.log('Transaction successful\n');
  }
}

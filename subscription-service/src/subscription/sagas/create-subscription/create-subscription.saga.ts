import { Injectable } from '@nestjs/common';

import {
  CreateLocalSubscriptionStep,
  CreateNotificationDBSubscriptionStep,
} from './steps';
import { Subscription } from '../../../subscription/entities';
import { ISaga, IStep } from '../interfaces';

@Injectable()
export class CreateSubscriptionSaga implements ISaga<Partial<Subscription>> {
  private steps: IStep<Partial<Subscription>>[] = [];

  constructor(
    private readonly step1: CreateLocalSubscriptionStep,
    private readonly step2: CreateNotificationDBSubscriptionStep,
  ) {
    this.steps = [step1, step2];
  }

  async start(subscription: Partial<Subscription>): Promise<void> {
    const successfulSteps: IStep<Partial<Subscription>>[] = [];

    console.log('Starting create subscription saga...');

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

    console.log('Transaction successful');
  }
}

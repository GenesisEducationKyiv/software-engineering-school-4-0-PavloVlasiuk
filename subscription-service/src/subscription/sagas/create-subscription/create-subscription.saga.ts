import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

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
    @InjectPinoLogger(CreateSubscriptionSaga.name)
    private readonly logger: PinoLogger,
    private readonly step1: CreateLocalSubscriptionStep,
    private readonly step2: CreateNotificationDBSubscriptionStep,
  ) {
    this.steps = [step1, step2];
  }

  async start(subscription: Partial<Subscription>): Promise<void> {
    const successfulSteps: IStep<Partial<Subscription>>[] = [];

    this.logger.info('Starting create subscription saga...');

    for (const step of this.steps) {
      try {
        await step.execute(subscription);

        successfulSteps.unshift(step);
      } catch (error) {
        this.logger.error(`Create subscription saga failed: ${error}`);

        if (!successfulSteps.length) throw error;

        for (const successfulStep of successfulSteps) {
          await successfulStep.compensate(subscription);
        }

        throw error;
      }
    }

    this.logger.info('Create subscription saga was completed successfully');
  }
}

import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import {
  DeleteLocalSubscriptionStep,
  DeleteNotificationDBSubscriptionStep,
} from './steps';
import { Subscription } from '../../../subscription/entities';
import { ISaga, IStep } from '../interfaces';

@Injectable()
export class DeleteSubscriptionSaga implements ISaga<Partial<Subscription>> {
  private steps: IStep<Partial<Subscription>>[] = [];

  constructor(
    @InjectPinoLogger(DeleteSubscriptionSaga.name)
    private readonly logger: PinoLogger,
    private readonly step1: DeleteLocalSubscriptionStep,
    private readonly step2: DeleteNotificationDBSubscriptionStep,
  ) {
    this.steps = [step1, step2];
  }

  async start(subscription: Partial<Subscription>): Promise<void> {
    const successfulSteps: IStep<Partial<Subscription>>[] = [];

    this.logger.info('Starting delete subscription saga...');

    for (const step of this.steps) {
      try {
        await step.execute(subscription);

        successfulSteps.unshift(step);
      } catch (error) {
        this.logger.error(`Delete subscription saga failed: ${error}`);

        if (!successfulSteps.length) throw error;

        for (const successfulStep of successfulSteps) {
          await successfulStep.compensate(subscription);
        }

        throw error;
      }
    }

    this.logger.info('Delete subscription saga was completed successfully');
  }
}

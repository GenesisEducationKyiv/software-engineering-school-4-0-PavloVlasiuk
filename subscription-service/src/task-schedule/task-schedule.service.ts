import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

import { TIMEZONE } from './task-schedule.constants';
import { RateService } from '../rate/rate.service';
import {
  ISubscriptionService,
  SUBSCRIPTION_SERVICE,
} from '../subscription/interfaces';

@Injectable()
export class TaskScheduleService {
  constructor(
    private readonly rateService: RateService,
    @Inject('RabbitService')
    private readonly client: ClientProxy,
    @Inject(SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {
    client.connect();
  }

  @Cron(CronExpression.EVERY_30_SECONDS, { timeZone: TIMEZONE })
  async sendCurrentRateEmail(): Promise<void> {
    const rate = await firstValueFrom(this.rateService.getCurrentRate());

    const subscribers = await this.subscriptionService.getAllSubscribers();

    const recipients = subscribers.map(({ email }) => ({ email }));

    this.client.emit('rate-email', { rate, recipients });
  }
}

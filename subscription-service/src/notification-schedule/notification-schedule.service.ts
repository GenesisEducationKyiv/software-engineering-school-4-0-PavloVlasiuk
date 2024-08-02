import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

import { TIMEZONE } from './notification-schedule.constants';
import { EVENT_SERVICE, IEventService } from '../event/interfaces';
import { RateService } from '../rate/rate.service';
import {
  ISubscriptionService,
  SUBSCRIPTION_SERVICE,
} from '../subscription/interfaces';

@Injectable()
export class NotificationScheduleService {
  constructor(
    private readonly rateService: RateService,
    @Inject(EVENT_SERVICE)
    private readonly eventService: IEventService,
    @Inject(SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM, { timeZone: TIMEZONE })
  async sendCurrentRateEmail(): Promise<void> {
    const exchangeRate = await firstValueFrom(
      this.rateService.getCurrentRate(),
    );

    const subscribers = await this.subscriptionService.getAllSubscribers();

    for (const subscriber of subscribers) {
      this.eventService.emitRateEmail({ subscriber, exchangeRate });
    }
  }
}

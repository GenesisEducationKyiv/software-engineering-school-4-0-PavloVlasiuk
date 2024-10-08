import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { INotificationScheduleService } from './interfaces';
import { TIMEZONE } from './notification-schedule.constants';
import {
  INotificationService,
  NOTIFICATION_SERVICE,
} from '../notification/interfaces';
import { IRateService, RATE_SERVICE } from '../rate/interfaces';
import {
  ISubscriptionService,
  SUBSCRIPTION_SERVICE,
} from '../subscription/interfaces';

@Injectable()
export class NotificationScheduleService
  implements INotificationScheduleService
{
  constructor(
    @Inject(RATE_SERVICE)
    private readonly rateService: IRateService,
    @Inject(SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: INotificationService,
    @InjectPinoLogger(NotificationScheduleService.name)
    private readonly logger: PinoLogger,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM, { timeZone: TIMEZONE })
  async sendRateEmail(): Promise<void> {
    const date = new Date().toDateString();

    this.logger.info(`${date} - Daily exchange rate email notification job`);

    const rate = await this.rateService.getLatest();

    const subscribers = await this.subscriptionService.getAllSubscribers();

    if (!subscribers.length) {
      this.logger.info(`${date} - There are no subscribers yet`);
      return;
    }

    const emailPromises: Array<Promise<void>> = subscribers.map(({ email }) =>
      this.notificationService.sendRateEmail({ email, rate }),
    );

    await Promise.all(emailPromises);
  }
}

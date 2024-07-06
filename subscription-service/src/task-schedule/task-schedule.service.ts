import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TIMEZONE } from './task-schedule.constants';
import { RateService } from 'src/rate/rate.service';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ISubscriptionService,
  SUBSCRIPTION_SERVICE,
} from 'src/subscription/interfaces';
import {
  NOTIFICATION_PACKAGE_NAME,
  NOTIFICATION_SERVICE_NAME,
  NotificationServiceClient,
} from '../../../proto/dist/types/notification';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TaskScheduleService implements OnModuleInit {
  private notificationService: NotificationServiceClient;

  constructor(
    private readonly rateService: RateService,
    @Inject(NOTIFICATION_PACKAGE_NAME)
    private readonly client: ClientGrpc,
    @Inject(SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  onModuleInit() {
    this.notificationService =
      this.client.getService<NotificationServiceClient>(
        NOTIFICATION_SERVICE_NAME,
      );
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM, { timeZone: TIMEZONE })
  async sendCurrentRateEmail(): Promise<void> {
    const rate = await firstValueFrom(this.rateService.getCurrentRate());

    const subscribers = await this.subscriptionService.getAllSubscribers();

    const recipients = subscribers.map(({ email }) => ({ email }));

    await firstValueFrom(
      this.notificationService.sendRateEmail({ rate, recipients }),
    );
  }
}

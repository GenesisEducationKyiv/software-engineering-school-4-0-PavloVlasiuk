import { Module } from '@nestjs/common';

import { notificationScheduleProviders } from './notification-schedule.providers';
import { NotificationModule } from '../notification/notification.module';
import { RateModule } from '../rate/rate.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [RateModule, SubscriptionModule, NotificationModule],
  providers: [...notificationScheduleProviders],
})
export class NotificationScheduleModule {}

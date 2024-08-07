import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';
import { NotificationScheduleModule } from './notification-schedule/notification-schedule.module';
import { RateModule } from './rate/rate.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    DatabaseModule,
    SubscriptionModule,
    RateModule,
    ScheduleModule.forRoot(),
    EventModule,
    NotificationScheduleModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from './database/database.module';
import { RateModule } from './rate/rate.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TaskScheduleModule } from './task-schedule/task-schedule.module';

@Module({
  imports: [
    DatabaseModule,
    SubscriptionModule,
    RateModule,
    ScheduleModule.forRoot(),
    TaskScheduleModule,
  ],
})
export class AppModule {}

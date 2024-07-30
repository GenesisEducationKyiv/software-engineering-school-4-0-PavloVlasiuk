import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { RateModule } from './rate/rate.module';
import { TaskScheduleModule } from './task-schedule/task-schedule.module';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from './database/database.module';
import { RateModule } from './rate/rate.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [DatabaseModule, SubscriptionModule, EventModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { RateModule } from './rate/rate.module';
import { TaskScheduleModule } from './task-schedule/task-schedule.module';

@Module({
  imports: [
    DatabaseModule,
    RateModule,
    EmailModule,
    TaskScheduleModule,
    ScheduleModule.forRoot(),
    AppConfigModule,
  ],
})
export class AppModule {}

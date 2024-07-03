import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';

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
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
})
export class AppModule {}

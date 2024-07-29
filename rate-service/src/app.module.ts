import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';

import { AppConfigModule } from './config/app-config';
import { RateModule } from './rate/rate.module';
import { RateSyncScheduleModule } from './rate-sync-schedule/rate-sync-schedule.module';

@Module({
  imports: [
    AppConfigModule,
    RateModule,
    RateSyncScheduleModule,
    ScheduleModule.forRoot(),
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

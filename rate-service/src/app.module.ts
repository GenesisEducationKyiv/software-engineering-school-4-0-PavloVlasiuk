import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule, Params } from 'nestjs-pino';

import { AppConfigModule, AppConfigService } from './config/app-config';
import { RateModule } from './rate/rate.module';
import { RateSyncScheduleModule } from './rate-sync-schedule/rate-sync-schedule.module';

@Module({
  imports: [
    AppConfigModule,
    RateModule,
    RateSyncScheduleModule,
    ScheduleModule.forRoot(),
    LoggerModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (config: AppConfigService) => {
        return config.get<Params>('logger.params');
      },
      inject: [AppConfigService],
    }),
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ClientsModule, RmqOptions } from '@nestjs/microservices';

import { NOTIFICATION_CLIENT } from './rate-sync-schedule.constants';
import { rateSyncScheduleProviders } from './rate-sync-schedule.providers';
import { AppConfigModule, AppConfigService } from '../config/app-config';
import { RateModule } from '../rate/rate.module';

@Module({
  imports: [
    RateModule,
    ClientsModule.registerAsync({
      clients: [
        {
          name: NOTIFICATION_CLIENT,
          imports: [AppConfigModule],
          useFactory: (config: AppConfigService) => {
            return config.get<RmqOptions>('rabbitmq.notificationClientOptions');
          },
          inject: [AppConfigService],
        },
      ],
    }),
  ],
  providers: [...rateSyncScheduleProviders],
})
export class RateSyncScheduleModule {}

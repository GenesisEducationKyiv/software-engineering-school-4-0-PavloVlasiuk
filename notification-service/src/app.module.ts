import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule, Params } from 'nestjs-pino';

import { AppConfigModule, AppConfigService } from './config/app-config';
import { DatabaseModule } from './database/database.module';
import { MailingModule } from './mailing/mailing.module';
import { NotificationModule } from './notification/notification.module';
import { NotificationScheduleModule } from './notification-schedule/notification-schedule.module';
import { RateModule } from './rate/rate.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    AppConfigModule,
    MailingModule,
    NotificationModule,
    DatabaseModule,
    SubscriptionModule,
    RateModule,
    ScheduleModule.forRoot(),
    NotificationScheduleModule,
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

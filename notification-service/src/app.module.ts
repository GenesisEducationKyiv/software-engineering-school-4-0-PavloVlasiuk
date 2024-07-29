import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/app-config';
import { DatabaseModule } from './database/database.module';
import { MailingModule } from './mailing/mailing.module';
import { NotificationModule } from './notification/notification.module';
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
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/app-config';
import { DatabaseModule } from './database/database.module';
import { MailingModule } from './mailing/mailing.module';
import { NotificationModule } from './notification/notification.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    AppConfigModule,
    MailingModule,
    NotificationModule,
    DatabaseModule,
    SubscriptionModule,
  ],
})
export class AppModule {}

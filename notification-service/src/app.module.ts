import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/app-config';
import { DatabaseModule } from './database/database.module';
import { MailingModule } from './mailing/mailing.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AppConfigModule, MailingModule, NotificationModule, DatabaseModule],
})
export class AppModule {}

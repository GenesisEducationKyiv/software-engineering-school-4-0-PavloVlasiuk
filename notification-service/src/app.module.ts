import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/app-config';
import { MailingModule } from './mailing/mailing.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AppConfigModule, MailingModule, NotificationModule],
})
export class AppModule {}

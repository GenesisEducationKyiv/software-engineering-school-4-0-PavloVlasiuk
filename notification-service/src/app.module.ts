import { Module } from '@nestjs/common';
import { MailingModule } from './mailing/mailing.module';
import { AppConfigModule } from './config/app-config';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AppConfigModule, MailingModule, NotificationModule],
})
export class AppModule {}

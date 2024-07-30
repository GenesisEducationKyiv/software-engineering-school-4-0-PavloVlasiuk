import { Module } from '@nestjs/common';

import { notificationProviders } from './notification.providers';
import { MailingModule } from '../mailing/mailing.module';

@Module({
  imports: [MailingModule],
  providers: [...notificationProviders],
  exports: [...notificationProviders],
})
export class NotificationModule {}

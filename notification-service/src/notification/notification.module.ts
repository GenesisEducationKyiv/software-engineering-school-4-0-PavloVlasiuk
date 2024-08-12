import { Module } from '@nestjs/common';

import { notificationProviders } from './notification.providers';
import { MailingModule } from '../mailing/mailing.module';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [MailingModule, MetricsModule],
  providers: [...notificationProviders],
  exports: [...notificationProviders],
})
export class NotificationModule {}

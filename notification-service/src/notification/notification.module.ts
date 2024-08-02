import { Module, Provider } from '@nestjs/common';

import { NOTIFICATION_SERVICE } from './interfaces';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MailingModule } from '../mailing/mailing.module';

const NotificationServiceImpl: Provider = {
  provide: NOTIFICATION_SERVICE,
  useClass: NotificationService,
};

@Module({
  imports: [MailingModule],
  controllers: [NotificationController],
  providers: [NotificationServiceImpl],
})
export class NotificationModule {}

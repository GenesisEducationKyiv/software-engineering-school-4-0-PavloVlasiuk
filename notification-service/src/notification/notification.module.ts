import { Module, Provider } from '@nestjs/common';
import { MailingModule } from 'src/mailing/mailing.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NOTIFICATION_SERVICE } from './interfaces';

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

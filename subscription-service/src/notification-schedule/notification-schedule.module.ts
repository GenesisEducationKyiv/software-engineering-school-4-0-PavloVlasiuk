import { Module, Provider } from '@nestjs/common';

import { NOTIFICATION_SCHEDULE_SERVICE } from './interfaces';
import { NotificationScheduleService } from './notification-schedule.service';
import { EventModule } from '../event/event.module';
import { RateModule } from '../rate/rate.module';
import { SubscriptionModule } from '../subscription/subscription.module';

const NotificationScheduleServiceImpl: Provider = {
  provide: NOTIFICATION_SCHEDULE_SERVICE,
  useClass: NotificationScheduleService,
};

@Module({
  imports: [RateModule, SubscriptionModule, EventModule],
  providers: [NotificationScheduleServiceImpl],
})
export class NotificationScheduleModule {}

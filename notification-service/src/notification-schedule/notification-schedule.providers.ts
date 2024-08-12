import { Provider } from '@nestjs/common';

import { NOTIFICATION_SCHEDULE_SERVICE } from './interfaces';
import { NotificationScheduleService } from './notification-schedule.service';

const notificationScheduleService: Provider = {
  provide: NOTIFICATION_SCHEDULE_SERVICE,
  useClass: NotificationScheduleService,
};

export const notificationScheduleProviders = [notificationScheduleService];

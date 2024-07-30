import { Provider } from '@nestjs/common';

import { NOTIFICATION_SERVICE } from './interfaces';
import { NotificationService } from './notification.service';

const notificationService: Provider = {
  provide: NOTIFICATION_SERVICE,
  useClass: NotificationService,
};

export const notificationProviders = [notificationService];

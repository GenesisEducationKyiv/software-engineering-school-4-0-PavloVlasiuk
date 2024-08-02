import { Inject } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { SendRateEmailRequestDto } from './dto/requests/send-rate-email.request.dto';
import { INotificationService, NOTIFICATION_SERVICE } from './interfaces';
import {
  NotificationServiceControllerMethods,
  NotificationServiceController,
  Empty,
} from '../../../proto/dist/types/notification';

@NotificationServiceControllerMethods()
export class NotificationController implements NotificationServiceController {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: INotificationService,
  ) {}

  sendRateEmail(
    @Payload() request: SendRateEmailRequestDto,
  ): Empty | Promise<Empty> | Observable<Empty> {
    return this.notificationService.sendRateEmail(
      request.rate,
      request.recipients,
    );
  }
}

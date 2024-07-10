import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { SendRateEmailRequestDto } from './dto/requests/send-rate-email.request.dto';
import { INotificationService, NOTIFICATION_SERVICE } from './interfaces';

@Controller()
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: INotificationService,
  ) {}

  @EventPattern('rate-email')
  async sendRateEmail(@Payload() data: SendRateEmailRequestDto): Promise<void> {
    return this.notificationService.sendRateEmail(data.rate, data.recipients);
  }
}

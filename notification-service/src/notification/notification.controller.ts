import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { SendRateEmailRequestDto } from './dto/requests';
import { INotificationService, NOTIFICATION_SERVICE } from './interfaces';

@Controller()
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: INotificationService,
  ) {}

  @EventPattern('rate-email-scheduled')
  async sendRateEmail(@Payload() dto: SendRateEmailRequestDto): Promise<void> {
    return this.notificationService.sendRateEmail(dto.data);
  }
}

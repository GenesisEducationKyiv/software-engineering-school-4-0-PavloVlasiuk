import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { SendRateEmailRequestDto } from './dto/requests';
import { INotificationService, NOTIFICATION_SERVICE } from './interfaces';

@NotificationServiceControllerMethods()
export class NotificationController implements NotificationServiceController {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: INotificationService,
  ) {}

  @EventPattern('rate-email-scheduled')
  async sendRateEmail(
    @Payload() dto: SendRateEmailRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();

    const originalMessage = context.getMessage();

    try {
      await this.notificationService.sendRateEmail(dto.data);
      channel.ack(originalMessage);
    } catch (error) {
      console.log(`Email to ${dto.data.subscriberEmail} failed to sent`);
    }
  }
}

import { Controller, Inject } from '@nestjs/common';
import { INotificationService, NOTIFICATION_SERVICE } from './interfaces';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { SendRateEmailRequestDto } from './dto/requests/send-rate-email.request.dto';

@Controller()
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: INotificationService,
  ) {}

  @GrpcMethod(NOTIFICATION_SERVICE)
  async sendRateEmail(
    @Payload() payload: SendRateEmailRequestDto,
  ): Promise<void> {
    await this.notificationService.sendRateEmail(
      payload.rate,
      payload.recipients,
    );
  }
}

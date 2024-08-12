import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { INotificationService, ISendRateData } from './interfaces';
import {
  IMailingService,
  ISendCurrentRateContext,
  MAILING_SERVICE,
} from '../mailing/interfaces';
import {
  INotificationMetricsService,
  NOTIFICATION_METRICS_SERVICE,
} from '../metrics/interfaces';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    @Inject(MAILING_SERVICE)
    private readonly mailingService: IMailingService,
    @InjectPinoLogger(NotificationService.name)
    private readonly logger: PinoLogger,
    @Inject(NOTIFICATION_METRICS_SERVICE)
    private readonly metricsService: INotificationMetricsService,
  ) {}

  async sendRateEmail({ email, rate }: ISendRateData): Promise<void> {
    const context: ISendCurrentRateContext = {
      rate: rate.value,
      date: new Date(rate.exchangeDate).toDateString(),
    };

    try {
      await this.mailingService.sendTemplatedEmail({
        to: email,
        context,
      });

      this.metricsService.incRateEmailSentCounter();
    } catch (error) {
      this.logger.error(
        `Daily notification - Email to ${email} failed to sent`,
        { error },
      );

      this.metricsService.incRateEmailFailedCounter();
    }
  }
}

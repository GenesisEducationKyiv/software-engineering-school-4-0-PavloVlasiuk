import { Inject, Injectable } from '@nestjs/common';

import { INotificationService, ISendRateData } from './interfaces';
import {
  IMailingService,
  ISendCurrentRateContext,
  MAILING_SERVICE,
} from '../mailing/interfaces';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    @Inject(MAILING_SERVICE) private readonly mailingService: IMailingService,
  ) {}

  async sendRateEmail({
    subscriberEmail,
    exchangeRate,
  }: ISendRateData): Promise<void> {
    const context: ISendCurrentRateContext = {
      rate: exchangeRate.rate,
      date: new Date(exchangeRate.exchangeDate).toDateString(),
    };

    await this.mailingService.sendTemplatedEmail({
      to: subscriberEmail,
      context,
    });
  }
}

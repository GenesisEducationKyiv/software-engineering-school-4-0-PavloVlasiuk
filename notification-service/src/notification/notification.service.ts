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
    @Inject(MAILING_SERVICE)
    private readonly mailingService: IMailingService,
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
    } catch (error) {
      console.log(`Email to ${email} failed to sent`);
    }
  }
}

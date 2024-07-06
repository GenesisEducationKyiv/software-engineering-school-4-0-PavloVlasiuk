import { Inject, Injectable } from '@nestjs/common';
import { IExchangeRate, INotificationService, IRecipient } from './interfaces';
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

  async sendRateEmail(
    { rate, exchangeDate }: IExchangeRate,
    recipients: IRecipient[],
  ): Promise<void> {
    const context: ISendCurrentRateContext = {
      rate,
      date: new Date(exchangeDate).toDateString(),
    };

    const emailPromises: Array<Promise<void>> = recipients.map(({ email }) =>
      this.mailingService.sendTemplatedEmail({
        to: email,
        context,
      }),
    );

    Promise.all(emailPromises);
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { IExchangeRate } from '../../rate/interfaces';
import { SubscribeEmailDto } from '../dtos/subscribe-email.dto';
import { Email } from '../entities/email.entity';
import { AlreadySubscribedException } from '../exceptions';
import {
  IEmailRepository,
  IMailingService,
  MAILING_SERVICE,
  ISendCurrentRateContext,
  EMAIL_REPOSITORY,
} from '../interfaces';

@Injectable()
export class EmailService {
  constructor(
    @Inject(EMAIL_REPOSITORY)
    private readonly emailRepository: IEmailRepository,
    @Inject(MAILING_SERVICE)
    private readonly mailingService: IMailingService,
  ) {}

  async subscribe({ email }: SubscribeEmailDto): Promise<void> {
    const alreadySubscribed = await this.emailRepository.findByEmail(email);

    if (alreadySubscribed) throw new AlreadySubscribedException();

    await this.emailRepository.create(email);
  }

  async sendRate({ rate }: IExchangeRate): Promise<void> {
    const subscribers: Email[] = await this.getAllSubscribers();

    const context: ISendCurrentRateContext = {
      rate,
      date: new Date().toDateString(),
    };

    const emailPromises: Array<Promise<void>> = subscribers.map(({ email }) =>
      this.mailingService.sendTemplatedEmail({
        to: email,
        context,
      }),
    );

    Promise.all(emailPromises);
  }

  private async getAllSubscribers(): Promise<Email[]> {
    return this.emailRepository.findAll();
  }
}

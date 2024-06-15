import { Injectable } from '@nestjs/common';
import { Email } from '@prisma/client';

import { NodeMailerService } from './node-mailer.service';
import { AlreadySubscribedException } from '../../common/exceptions';
import { EmailRepository } from '../../database/repositories/email.repository';
import { IExchangeRate } from '../../rate/interfaces';
import { SubscribeEmailDto } from '../dtos/subscribe-email.dto';
import { ISendCurrentRateContext } from '../interfaces/send-email-options.interface';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailRepository: EmailRepository,
    private readonly nodeMailerService: NodeMailerService,
  ) {}

  async subscribe({ email }: SubscribeEmailDto): Promise<void> {
    const alreadySubscribed = await this.emailRepository.find({ email });

    if (alreadySubscribed) throw new AlreadySubscribedException();

    await this.emailRepository.create({ email });
  }

  async sendCurrentRate({ rate }: IExchangeRate): Promise<void> {
    const subscribers: Array<Email> = await this.getAllSubscribers();

    const context: ISendCurrentRateContext = {
      rate,
      date: new Date().toDateString(),
    };

    const emailPromises: Array<Promise<void>> = subscribers.map(({ email }) =>
      this.nodeMailerService.sendTemplatedEmail({
        to: email,
        context,
      }),
    );

    Promise.all(emailPromises);
  }

  private async getAllSubscribers(): Promise<Array<Email>> {
    return this.emailRepository.findMany();
  }
}

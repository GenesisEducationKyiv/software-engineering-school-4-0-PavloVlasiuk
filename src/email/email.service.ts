import { Injectable } from '@nestjs/common';
import { ISendEmailOptions } from './interfaces/send-email-options.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailRepository } from '../database/repositories/email.repository';
import { SubscribeEmailDto } from './dtos/subscribe-email.dto';
import * as path from 'path';
import { Email } from '@prisma/client';
import { AlreadySubscribedException } from '../common/exceptions';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly emailRepository: EmailRepository,
  ) {}

  async sendTemplatedEmail({
    to,
    subject,
    context,
  }: ISendEmailOptions): Promise<void> {
    await this.mailerService
      .sendMail({
        to,
        subject,
        template: path.resolve(
          './src/email/templates/exchange-rate.template.hbs',
        ),
        context,
      })
      .catch((e) => {
        console.error(`Sending email error: ${e}`);
      });
  }

  async subscribe({ email }: SubscribeEmailDto): Promise<void> {
    const alreadySubscribed = await this.emailRepository.find({ email });

    if (alreadySubscribed) throw new AlreadySubscribedException();

    await this.emailRepository.create({ email });
  }

  async getAllSubscribers(): Promise<Array<Email>> {
    return this.emailRepository.findMany();
  }
}

import { resolve } from 'path';

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { DEFAULT_EMAIL_SUBJECT } from '../email.constants';
import { ISendEmailOptions } from '../interfaces/send-email-options.interface';

@Injectable()
export class NodeMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTemplatedEmail({
    to,
    context,
    subject = DEFAULT_EMAIL_SUBJECT,
  }: ISendEmailOptions): Promise<void> {
    await this.mailerService
      .sendMail({
        to,
        subject,
        template: resolve('./src/email/templates/exchange-rate.template.hbs'),
        context,
      })
      .catch((e) => {
        console.error(`Sending email error: ${e}`);
      });
  }
}

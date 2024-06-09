import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';
import { RateService } from '../rate/rate.service';
import { EMAIL_SUBJECT, TIMEZONE } from './task-schedule.constants';

@Injectable()
export class TaskScheduleService {
  constructor(
    private readonly rateService: RateService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM, { timeZone: TIMEZONE })
  public async sendCurrentRate(): Promise<void> {
    const { rate } = await this.rateService.getCurrentRate();

    const subscribers = await this.emailService.getAllSubscribers();

    const context = {
      rate,
      date: new Date().toDateString(),
    };

    const emailPromises: Array<Promise<void>> = [];

    for (const subscriber of subscribers) {
      emailPromises.push(
        this.emailService.sendTemplatedEmail({
          to: subscriber.email,
          subject: EMAIL_SUBJECT,
          context,
        }),
      );
    }

    Promise.all(emailPromises);
  }
}

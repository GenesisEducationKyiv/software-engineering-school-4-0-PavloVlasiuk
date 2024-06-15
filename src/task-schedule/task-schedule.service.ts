import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { TIMEZONE } from './task-schedule.constants';
import { EmailService } from '../email/services/email.service';
import { RateService } from '../rate/rate.service';

@Injectable()
export class TaskScheduleService {
  constructor(
    private readonly emailService: EmailService,
    private readonly rateService: RateService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM, { timeZone: TIMEZONE })
  async sendCurrentRateEmail(): Promise<void> {
    const rate = await this.rateService.getCurrentRate();

    await this.emailService.sendCurrentRate(rate);
  }
}

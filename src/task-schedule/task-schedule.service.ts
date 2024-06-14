import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { TIMEZONE } from './task-schedule.constants';
import { EmailService } from '../email/services/email.service';

@Injectable()
export class TaskScheduleService {
  constructor(private readonly emailService: EmailService) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM, { timeZone: TIMEZONE })
  async sendCurrentRateEmail(): Promise<void> {
    await this.emailService.sendCurrentRate();
  }
}

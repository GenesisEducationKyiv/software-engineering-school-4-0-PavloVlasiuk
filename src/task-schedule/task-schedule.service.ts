import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ITaskScheduleService } from './interfaces';
import { TIMEZONE } from './task-schedule.constants';
import { EMAIL_SERVICE, IEmailService } from '../email/interfaces';
import { IRateService, RATE_SERVICE } from '../rate/interfaces';

@Injectable()
export class TaskScheduleService implements ITaskScheduleService {
  constructor(
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
    @Inject(RATE_SERVICE)
    private readonly rateService: IRateService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM, { timeZone: TIMEZONE })
  async sendCurrentRateEmail(): Promise<void> {
    const rate = await this.rateService.getCurrentRate();

    await this.emailService.sendRate(rate);
  }
}

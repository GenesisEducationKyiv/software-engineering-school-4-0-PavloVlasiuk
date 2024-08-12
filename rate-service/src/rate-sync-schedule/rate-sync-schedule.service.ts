import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { lastValueFrom } from 'rxjs';

import { IRateSyncScheduleService } from './interfaces';
import {
  COMMANDS,
  NOTIFICATION_CLIENT,
  TIMEZONE,
} from './rate-sync-schedule.constants';
import { IResponse } from '../common/interfaces';
import { IRateService, RATE_SERVICE } from '../rate/interfaces';

@Injectable()
export class RateSyncScheduleService implements IRateSyncScheduleService {
  constructor(
    @Inject(RATE_SERVICE)
    private readonly rateService: IRateService,
    @Inject(NOTIFICATION_CLIENT)
    private readonly notificationClient: ClientProxy,
    @InjectPinoLogger(RateSyncScheduleService.name)
    private readonly logger: PinoLogger,
  ) {
    notificationClient.connect();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, { timeZone: TIMEZONE })
  async synchronize(): Promise<void> {
    const date = new Date().toDateString();

    this.logger.info(`${date} - Daily exchange rate synchronization job`);

    const exchangeRate = await this.rateService.getCurrentRate();

    const response = await lastValueFrom<IResponse>(
      this.notificationClient.send(COMMANDS.RATE_SYNCHRONIZE, exchangeRate),
    );

    if (!response.success) {
      this.logger.error(`${date} - Failed to synchronize exchange rate`);
    }
  }
}

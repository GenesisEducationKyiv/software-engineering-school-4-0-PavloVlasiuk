import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
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
  ) {
    notificationClient.connect();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, { timeZone: TIMEZONE })
  async synchronize(): Promise<void> {
    console.log('Rate synchronize job');

    const exchangeRate = await this.rateService.getCurrentRate();

    const response = await lastValueFrom<IResponse>(
      this.notificationClient.send(COMMANDS.RATE_SYNCHRONIZE, exchangeRate),
    );

    if (!response.success) {
      console.log('Failed to synchronize exchange rate');
    }
  }
}

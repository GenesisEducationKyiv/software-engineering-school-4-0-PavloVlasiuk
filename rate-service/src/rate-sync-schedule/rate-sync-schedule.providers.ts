import { Provider } from '@nestjs/common';

import { RATE_SYNC_SCHEDULE_SERVICE } from './interfaces';
import { RateSyncScheduleService } from './rate-sync-schedule.service';

const rateSyncScheduleService: Provider = {
  provide: RATE_SYNC_SCHEDULE_SERVICE,
  useClass: RateSyncScheduleService,
};

export const rateSyncScheduleProviders = [rateSyncScheduleService];

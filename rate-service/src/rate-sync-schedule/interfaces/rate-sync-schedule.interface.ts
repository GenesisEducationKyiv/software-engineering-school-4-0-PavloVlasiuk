export const RATE_SYNC_SCHEDULE_SERVICE = 'RateSyncScheduleService';

export interface IRateSyncScheduleService {
  synchronize(): Promise<void>;
}

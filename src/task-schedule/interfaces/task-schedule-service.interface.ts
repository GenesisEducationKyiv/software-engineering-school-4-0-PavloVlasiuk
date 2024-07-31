export const TASK_SCHEDULE_SERVICE = 'TaskScheduleService';

export interface ITaskScheduleService {
  sendCurrentRateEmail(): Promise<void>;
}

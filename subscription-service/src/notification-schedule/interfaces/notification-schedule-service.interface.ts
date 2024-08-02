export const NOTIFICATION_SCHEDULE_SERVICE = 'NotificationScheduleService';

export interface INotificationScheduleService {
  sendCurrentRateEmail(): Promise<void>;
}

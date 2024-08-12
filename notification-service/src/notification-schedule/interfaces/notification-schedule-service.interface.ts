export const NOTIFICATION_SCHEDULE_SERVICE = 'NotificationScheduleService';

export interface INotificationScheduleService {
  sendRateEmail(): Promise<void>;
}

import { ISendRateData } from './send-rate-data.interface';

export const NOTIFICATION_SERVICE = 'NotificationService';

export interface INotificationService {
  sendRateEmail(data: ISendRateData): Promise<void>;
}

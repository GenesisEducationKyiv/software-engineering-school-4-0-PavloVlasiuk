import { IExchangeRate } from './exchange-rate.interface';
import { IRecipient } from './recipient.interface';

export const NOTIFICATION_SERVICE = 'NotificationService';

export interface INotificationService {
  sendRateEmail(rate: IExchangeRate, recipients: IRecipient[]): Promise<void>;
}

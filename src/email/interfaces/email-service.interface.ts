import { IExchangeRate } from '../../rate/interfaces';
import { SubscribeEmailDto } from '../dtos/subscribe-email.dto';

export const EMAIL_SERVICE = 'EmailService';

export interface IEmailService {
  subscribe(subscribeEmailDto: SubscribeEmailDto): Promise<void>;
  sendRate(exchangeRate: IExchangeRate): Promise<void>;
}

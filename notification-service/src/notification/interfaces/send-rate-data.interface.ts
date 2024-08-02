import { IExchangeRate } from './exchange-rate.interface';

export interface ISendRateData {
  subscriberId: string;
  subscriberEmail: string;
  exchangeRate: IExchangeRate;
}

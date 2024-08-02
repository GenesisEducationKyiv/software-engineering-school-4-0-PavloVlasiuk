import { IExchangeRate } from './exchange-rate.interface';
import { Subscription } from '../../subscription/entities';

export interface ISendRateData {
  subscriber: Subscription;
  exchangeRate: IExchangeRate;
}

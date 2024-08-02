import { IEvent } from './event.interface';
import { IExchangeRate } from './exchange-rate.interface';

export interface ISendRateEvent extends IEvent {
  data: {
    subscriberId: string;
    subscriberEmail: string;
    exchangeRate: IExchangeRate;
  };
}

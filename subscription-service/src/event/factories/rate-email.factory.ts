import { EventFactory } from './event.factory';
import { ISendRateData, ISendRateEvent } from '../interfaces';

export class RateEmailFactory extends EventFactory<ISendRateData> {
  createEvent(data: ISendRateData): ISendRateEvent {
    return this.createBaseEvent('RateEmailScheduled', data.subscriber.id, {
      subscriberId: data.subscriber.id,
      subscriberEmail: data.subscriber.email,
      exchangeRate: data.exchangeRate,
    });
  }
}

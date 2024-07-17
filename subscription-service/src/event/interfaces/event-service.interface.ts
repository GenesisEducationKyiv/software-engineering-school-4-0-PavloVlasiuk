import { ISendRateData } from './send-rate-data.interface';

export const EVENT_SERVICE = 'EventService';

export interface IEventService {
  emitRateEmail(eventData: ISendRateData): void;
}

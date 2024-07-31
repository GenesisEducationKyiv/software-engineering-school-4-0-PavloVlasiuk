import { randomUUID } from 'crypto';

import { IEvent } from '../interfaces';

export abstract class EventFactory<T> {
  abstract createEvent(data: T): IEvent;

  protected createBaseEvent(
    eventType: string,
    aggregateId: string,
    data: any,
  ): IEvent {
    return {
      eventId: randomUUID(),
      eventType,
      aggregateId,
      timestamp: new Date(),
      data,
    };
  }
}

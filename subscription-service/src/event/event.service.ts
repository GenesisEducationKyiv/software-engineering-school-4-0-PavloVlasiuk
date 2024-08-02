import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NOTIFICATION_CLIENT } from './event.constants';
import { RateEmailFactory } from './factories';
import { ISendRateData } from './interfaces';
import { IEventService } from './interfaces/event-service.interface';

@Injectable()
export class EventService implements IEventService {
  constructor(
    @Inject(NOTIFICATION_CLIENT)
    private readonly notificationClient: ClientProxy,
  ) {
    notificationClient.connect();
  }

  emitRateEmail(data: ISendRateData): void {
    const rateEmailFactory = new RateEmailFactory();

    const eventData = rateEmailFactory.createEvent(data);

    this.notificationClient.emit('rate-email-scheduled', eventData);
  }
}

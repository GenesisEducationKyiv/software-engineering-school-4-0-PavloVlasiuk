import { Module, Provider } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { NOTIFICATION_CLIENT } from './event.constants';
import { EventService } from './event.service';
import { EVENT_SERVICE } from './interfaces';

const EventServiceImpl: Provider = {
  provide: EVENT_SERVICE,
  useClass: EventService,
};

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NOTIFICATION_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: process.env.RABBITMQ_QUEUE,
          persistent: true,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [EventServiceImpl],
  exports: [EventServiceImpl],
})
export class EventModule {}

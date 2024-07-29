import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { NOTIFICATION_CLIENT } from './rate-sync-schedule.constants';
import { rateSyncScheduleProviders } from './rate-sync-schedule.providers';
import { RateModule } from '../rate/rate.module';

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
    RateModule,
  ],
  providers: [...rateSyncScheduleProviders],
})
export class RateSyncScheduleModule {}

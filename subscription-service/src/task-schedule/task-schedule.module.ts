import { Module, Provider } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TASK_SCHEDULE_SERVICE } from './interfaces';
import { TaskScheduleService } from './task-schedule.service';
import { RateModule } from '../rate/rate.module';
import { SubscriptionModule } from '../subscription/subscription.module';

const TaskScheduleServiceImpl: Provider = {
  provide: TASK_SCHEDULE_SERVICE,
  useClass: TaskScheduleService,
};

@Module({
  imports: [
    RateModule,
    SubscriptionModule,
    ClientsModule.register([
      {
        name: 'RabbitService',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: process.env.RABBITMQ_QUEUE,
        },
      },
    ]),
  ],
  providers: [TaskScheduleServiceImpl],
  exports: [TaskScheduleServiceImpl],
})
export class TaskScheduleModule {}

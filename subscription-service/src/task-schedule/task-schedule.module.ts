import { Module, Provider } from '@nestjs/common';

import { TASK_SCHEDULE_SERVICE } from './interfaces';
import { TaskScheduleService } from './task-schedule.service';
import { RateModule } from '../rate/rate.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NOTIFICATION_PACKAGE_NAME } from '../../../proto/dist/types/notification';

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
        name: NOTIFICATION_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: `${process.env.NOTIFICATION_SERVICE_HOST}:${process.env.NOTIFICATION_SERVICE_PORT}`,
          package: NOTIFICATION_PACKAGE_NAME,
          protoPath: join(
            __dirname,
            '../../../../../proto/notification/notification.proto',
          ),
        },
      },
    ]),
  ],
  providers: [TaskScheduleServiceImpl],
  exports: [TaskScheduleServiceImpl],
})
export class TaskScheduleModule {}
import { Module, Provider } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { SUBSCRIPTION_REPOSITORY, SUBSCRIPTION_SERVICE } from './interfaces';
import { SubscriptionRepository } from './repositories';
import { CreateSubscriptionSaga } from './sagas/create-subscription';
import {
  CreateLocalSubscriptionStep,
  CreateNotificationDBSubscriptionStep,
} from './sagas/create-subscription/steps';
import { DeleteSubscriptionSaga } from './sagas/delete-subscription';
import {
  DeleteLocalSubscriptionStep,
  DeleteNotificationDBSubscriptionStep,
} from './sagas/delete-subscription/steps';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { DatabaseModule } from '../database/database.module';

const SubscriptionRepositoryImpl: Provider = {
  provide: SUBSCRIPTION_REPOSITORY,
  useClass: SubscriptionRepository,
};

const SubscriptionServiceImpl: Provider = {
  provide: SUBSCRIPTION_SERVICE,
  useClass: SubscriptionService,
};

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'client',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'subscription_queue',
          persistent: true,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionRepositoryImpl,
    SubscriptionServiceImpl,
    CreateLocalSubscriptionStep,
    CreateNotificationDBSubscriptionStep,
    CreateSubscriptionSaga,
    DeleteLocalSubscriptionStep,
    DeleteNotificationDBSubscriptionStep,
    DeleteSubscriptionSaga,
  ],
  exports: [SubscriptionServiceImpl],
})
export class SubscriptionModule {}

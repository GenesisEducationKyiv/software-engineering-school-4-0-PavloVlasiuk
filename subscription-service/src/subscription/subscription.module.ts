import { Module, Provider } from '@nestjs/common';
import { ClientsModule, RmqOptions } from '@nestjs/microservices';

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
import { NOTIFICATION_CLIENT } from './subscription.constants';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { AppConfigModule, AppConfigService } from '../config/app-config';
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
    ClientsModule.registerAsync({
      clients: [
        {
          name: NOTIFICATION_CLIENT,
          imports: [AppConfigModule],
          useFactory: (config: AppConfigService) => {
            return config.get<RmqOptions>('rabbitmq.notificationClientOptions');
          },
          inject: [AppConfigService],
        },
      ],
    }),
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

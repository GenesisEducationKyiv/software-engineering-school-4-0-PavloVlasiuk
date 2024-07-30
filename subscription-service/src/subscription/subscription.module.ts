import { Module } from '@nestjs/common';
import { ClientsModule, RmqOptions } from '@nestjs/microservices';

import {
  CreateLocalSubscriptionStep,
  CreateNotificationDBSubscriptionStep,
} from './sagas/create-subscription/steps';
import {
  DeleteLocalSubscriptionStep,
  DeleteNotificationDBSubscriptionStep,
} from './sagas/delete-subscription/steps';
import { NOTIFICATION_CLIENT } from './subscription.constants';
import { SubscriptionController } from './subscription.controller';
import { subscriptionProviders } from './subscription.providers';
import { AppConfigModule, AppConfigService } from '../config/app-config';
import { DatabaseModule } from '../database/database.module';

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
    ...subscriptionProviders,
    CreateLocalSubscriptionStep,
    CreateNotificationDBSubscriptionStep,
    DeleteLocalSubscriptionStep,
    DeleteNotificationDBSubscriptionStep,
  ],
  exports: [...subscriptionProviders],
})
export class SubscriptionModule {}

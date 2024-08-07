import { join } from 'path';

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { SubscriptionController } from './subscription.controller';
import { SUBSCRIPTION_PACKAGE_NAME } from '../../../proto/dist/types/subscription';
import { AppConfigModule, AppConfigService } from '../config/app-config';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: SUBSCRIPTION_PACKAGE_NAME,
          useFactory: (config: AppConfigService) => {
            const host = config.get<string>('grpc.subscription.host');

            const port = config.get<string>('grpc.subscription.port');

            return {
              transport: Transport.GRPC,
              options: {
                url: `${host}:${port}`,
                package: SUBSCRIPTION_PACKAGE_NAME,
                protoPath: join(
                  __dirname,
                  '../../../../../proto/subscription/subscription.proto',
                ),
              },
            };
          },
          imports: [AppConfigModule],
          inject: [AppConfigService],
        },
      ],
    }),
  ],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}

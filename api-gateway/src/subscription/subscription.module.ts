import { ChannelOptions } from '@grpc/grpc-js';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SUBSCRIPTION_PACKAGE_NAME } from '@usd-to-uah-rate-api/proto/dist/subscription';

import { SubscriptionController } from './subscription.controller';
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

            const channelOptions = config.get<ChannelOptions>(
              'grpc.channelOptions',
            );

            return {
              transport: Transport.GRPC,
              options: {
                url: `${host}:${port}`,
                package: SUBSCRIPTION_PACKAGE_NAME,
                protoPath:
                  'node_modules/@usd-to-uah-rate-api/proto/subscription/subscription.proto',
                channelOptions,
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

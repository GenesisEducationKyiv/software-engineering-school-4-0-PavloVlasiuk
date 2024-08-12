import { ChannelOptions } from '@grpc/grpc-js';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RATE_PACKAGE_NAME } from '@usd-to-uah-rate-api/proto/dist/rate';

import { RateController } from './rate.controller';
import { AppConfigModule, AppConfigService } from '../config/app-config';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: RATE_PACKAGE_NAME,
          useFactory: (config: AppConfigService) => {
            const host = config.get<string>('grpc.rate.host');

            const port = config.get<string>('grpc.rate.port');

            const channelOptions = config.get<ChannelOptions>(
              'grpc.channelOptions',
            );

            return {
              transport: Transport.GRPC,
              options: {
                url: `${host}:${port}`,
                package: RATE_PACKAGE_NAME,
                protoPath:
                  'node_modules/@usd-to-uah-rate-api/proto/rate/rate.proto',
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
  controllers: [RateController],
})
export class RateModule {}

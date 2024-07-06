import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RATE_PACKAGE_NAME } from '../../../proto/dist/types/rate';
import { join } from 'path';
import { RateController } from './rate.controller';
import { AppConfigModule, AppConfigService } from 'src/config/app-config';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: RATE_PACKAGE_NAME,
          useFactory: (config: AppConfigService) => {
            const host = config.get<string>('grpc.rate.host');

            const port = config.get<string>('grpc.rate.port');

            return {
              transport: Transport.GRPC,
              options: {
                url: `${host}:${port}`,
                package: RATE_PACKAGE_NAME,
                protoPath: join(
                  __dirname,
                  '../../../../../proto/rate/rate.proto',
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
  controllers: [RateController],
})
export class RateModule {}

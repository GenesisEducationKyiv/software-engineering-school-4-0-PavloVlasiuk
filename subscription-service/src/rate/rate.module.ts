import { join } from 'path';

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { RateService } from './rate.service';
import {
  RATE_PACKAGE_NAME,
  RATE_SERVICE_NAME,
} from '../../../proto/dist/types/rate';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RATE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: `${process.env.RATE_SERVICE_HOST}:${process.env.RATE_SERVICE_PORT}`,
          package: RATE_PACKAGE_NAME,
          protoPath: join(__dirname, '../../../../../proto/rate/rate.proto'),
        },
      },
    ]),
  ],
  providers: [RateService],
  exports: [RateService],
})
export class RateModule {}

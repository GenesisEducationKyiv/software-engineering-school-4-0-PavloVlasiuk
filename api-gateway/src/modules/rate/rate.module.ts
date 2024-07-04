import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RATE_PACKAGE } from './types/rate';
import { join } from 'path';
import { RateController } from './rate.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RATE_PACKAGE,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:5001',
          package: 'rate',
          protoPath: join(__dirname, '../../../../proto/rate/rate.proto'),
        },
      },
    ]),
  ],
  controllers: [RateController],
})
export class RateModule {}

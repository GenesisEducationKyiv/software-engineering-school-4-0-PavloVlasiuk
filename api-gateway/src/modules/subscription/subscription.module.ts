import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SUBSCRIPTION_PACKAGE } from './types/subscription';
import { join } from 'path';
import { SubscriptionController } from './subscription.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SUBSCRIPTION_PACKAGE,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:5002',
          package: 'subscription',
          protoPath: join(
            __dirname,
            '../../../../proto/subscription/subscription.proto',
          ),
        },
      },
    ]),
  ],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}

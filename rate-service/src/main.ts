import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { RATE_PACKAGE_NAME } from '../../proto/dist/types/rate';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: RATE_PACKAGE_NAME,
        protoPath: join(__dirname, '../../../../proto/rate/rate.proto'),
        url: `${process.env.HOST}:${process.env.PORT}`,
      },
    },
  );

  await app.listen();
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RATE_PACKAGE_NAME } from '@usd-to-uah-rate-api/proto/dist/rate';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: RATE_PACKAGE_NAME,
      protoPath: 'node_modules/@usd-to-uah-rate-api/proto/rate/rate.proto',
      url: `${process.env.HOST}:${process.env.PORT}`,
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.HTTP_PORT);
}
bootstrap();

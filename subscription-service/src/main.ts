import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SUBSCRIPTION_PACKAGE_NAME } from '@usd-to-uah-rate-api/proto/dist/subscription';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: SUBSCRIPTION_PACKAGE_NAME,
      protoPath:
        'node_modules/@usd-to-uah-rate-api/proto/subscription/subscription.proto',

      url: `${process.env.HOST}:${process.env.PORT}`,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.startAllMicroservices();

  await app.listen(process.env.HTTP_PORT);
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { SUBSCRIPTION_PACKAGE_NAME } from '../../proto/dist/types/subscription';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: SUBSCRIPTION_PACKAGE_NAME,
        protoPath: join(
          __dirname,
          '../../../../proto/subscription/subscription.proto',
        ),
        url: `${process.env.HOST}:${process.env.PORT}`,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen();
}

bootstrap();

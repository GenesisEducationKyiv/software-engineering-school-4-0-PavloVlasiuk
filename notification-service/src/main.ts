import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './exceptions/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'subscription_queue',
      noAck: false,
      persistent: true,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'rate_queue',
      noAck: false,
      persistent: true,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.startAllMicroservices();

  await app.listen(0);
}
bootstrap();

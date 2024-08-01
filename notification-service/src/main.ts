import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config';
import { AllExceptionsFilter } from './exceptions/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get<AppConfigService>(AppConfigService);

  const queues = config.get<{ [K: string]: string }>('rabbitmq.queues');

  for (const queue of Object.values(queues)) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue,
        noAck: false,
        persistent: true,
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  const logger = app.get<Logger>(Logger);

  app.useGlobalFilters(new AllExceptionsFilter(logger));

  await app.startAllMicroservices();

  await app.listen(0);
}
bootstrap();

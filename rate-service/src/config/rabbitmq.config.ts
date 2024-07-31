import { registerAs } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

export default registerAs(
  'rabbitmq',
  (): Record<string, RmqOptions> => ({
    notificationClientOptions: {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_QUEUE,
        persistent: true,
        queueOptions: {
          durable: true,
        },
      },
    },
  }),
);

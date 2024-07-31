import { registerAs } from '@nestjs/config';

export default registerAs(
  'rabbitmq',
  (): Record<string, any> => ({
    queues: {
      subscription: process.env.RABBITMQ_SUBSCRIPTION_QUEUE,
      rate: process.env.RABBITMQ_RATE_QUEUE,
    },
  }),
);

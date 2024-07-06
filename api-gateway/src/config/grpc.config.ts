import { registerAs } from '@nestjs/config';

export default registerAs(
  'grpc',
  (): Record<string, any> => ({
    rate: {
      host: process.env.RATE_SERVICE_HOST,
      port: process.env.RATE_SERVICE_PORT,
    },
    subscription: {
      host: process.env.SUBSCRIPTION_SERVICE_HOST,
      port: process.env.SUBSCRIPTION_SERVICE_PORT,
    },
  }),
);

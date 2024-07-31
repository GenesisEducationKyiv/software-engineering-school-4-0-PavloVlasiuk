import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    port: Number.parseInt(process.env.PORT),
    host: process.env.HOST,
    globalPrefix: '/api',
  }),
);

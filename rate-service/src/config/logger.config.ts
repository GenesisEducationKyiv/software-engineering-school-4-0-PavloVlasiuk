import { registerAs } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export default registerAs(
  'logger',
  (): Record<string, Params> => ({
    params: {
      pinoHttp: {
        autoLogging: false,
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    },
  }),
);

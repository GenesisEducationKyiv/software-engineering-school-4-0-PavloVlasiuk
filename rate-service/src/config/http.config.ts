import { registerAs } from '@nestjs/config';

export default registerAs(
  'http',
  (): Record<string, any> => ({
    request: {
      timeout: 3000,
    },
  }),
);

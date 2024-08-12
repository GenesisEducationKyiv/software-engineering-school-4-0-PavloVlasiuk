import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    httpPort: Number(process.env.HTTP_PORT),
  }),
);

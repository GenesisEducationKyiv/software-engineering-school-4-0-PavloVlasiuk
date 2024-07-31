import { registerAs } from '@nestjs/config';

export default registerAs(
  'mongodb',
  (): Record<string, any> => ({
    uri: process.env.MONGODB_CONNECTION_STRING,
    name: process.env.MONGO_INITDB_DATABASE,
  }),
);

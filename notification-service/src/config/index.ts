import appConfig from './app.config';
import emailConfig from './email.config';
import loggerConfig from './logger.config';
import mongodbConfig from './mongodb.config';
import rabbitmqConfig from './rabbitmq.config';

export default [
  emailConfig,
  mongodbConfig,
  rabbitmqConfig,
  loggerConfig,
  appConfig,
];

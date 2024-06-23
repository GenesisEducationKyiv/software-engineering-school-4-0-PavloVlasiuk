import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigService = app.get<AppConfigService>(AppConfigService);

  const PORT = appConfigService.get<string>('app.port');

  const HOST = appConfigService.get<string>('app.host');

  const GLOBAL_PREFIX = appConfigService.get<string>('app.globalPrefix');

  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const logger = app.get<Logger>(Logger);

  app.useLogger(logger);

  await app.listen(PORT, HOST, async () => {
    logger.log(`Server is running on http://${HOST}:${PORT}`);
  });
}
bootstrap();

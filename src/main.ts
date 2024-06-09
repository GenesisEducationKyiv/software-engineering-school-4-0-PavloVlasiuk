import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { ValidationPipe } from '@nestjs/common';

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

  await app.listen(PORT, HOST, async () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
}
bootstrap();

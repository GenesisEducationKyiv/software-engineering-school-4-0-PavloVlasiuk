import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigService = app.get<AppConfigService>(AppConfigService);

  const PORT = appConfigService.get<number>('app.port');

  const HOST = appConfigService.get<string>('app.host');

  const GLOBAL_PREFIX = appConfigService.get<string>('app.globalPrefix');

  app.setGlobalPrefix(GLOBAL_PREFIX);

  await app.listen(PORT, HOST, async () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
}
bootstrap();

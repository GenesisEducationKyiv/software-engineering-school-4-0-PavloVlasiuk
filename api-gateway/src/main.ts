import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = 3000;

  const HOST = '0.0.0.0';

  const GLOBAL_PREFIX = '/api';

  app.setGlobalPrefix(GLOBAL_PREFIX);

  await app.listen(PORT, HOST, async () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
}
bootstrap();

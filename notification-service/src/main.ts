import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NOTIFICATION_PACKAGE_NAME } from '../../proto/dist/types/notification';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: NOTIFICATION_PACKAGE_NAME,
        protoPath: join(
          __dirname,
          '../../../../proto/notification/notification.proto',
        ),
        url: `${process.env.HOST}:${process.env.PORT}`,
      },
    },
  );

  await app.listen();
}
bootstrap();

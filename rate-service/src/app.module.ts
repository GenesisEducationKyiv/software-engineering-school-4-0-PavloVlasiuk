import { Module } from '@nestjs/common';
import { RateModule } from './rate/rate.module';
import { AppConfigModule } from './config/app-config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    AppConfigModule,
    RateModule,
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
})
export class AppModule {}

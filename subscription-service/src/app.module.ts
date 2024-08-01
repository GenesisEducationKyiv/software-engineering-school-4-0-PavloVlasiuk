import { Module } from '@nestjs/common';
import { LoggerModule, Params } from 'nestjs-pino';

import { AppConfigModule, AppConfigService } from './config/app-config';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    DatabaseModule,
    SubscriptionModule,
    EventModule,
    AppConfigModule,
    LoggerModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (config: AppConfigService) => {
        return config.get<Params>('logger.params');
      },
      inject: [AppConfigService],
    }),
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppConfigModule, AppConfigService } from '../config/app-config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (config: AppConfigService) => {
        return {
          uri: config.get<string>('mongodb.uri'),
          dbName: config.get<string>('mongodb.name'),
        };
      },
      inject: [AppConfigService],
    }),
  ],
})
export class DatabaseModule {}

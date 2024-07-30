import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/app-config';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [DatabaseModule, SubscriptionModule, EventModule, AppConfigModule],
})
export class AppModule {}

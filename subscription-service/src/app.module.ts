import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';
import { RateModule } from './rate/rate.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [DatabaseModule, SubscriptionModule, RateModule, EventModule],
})
export class AppModule {}

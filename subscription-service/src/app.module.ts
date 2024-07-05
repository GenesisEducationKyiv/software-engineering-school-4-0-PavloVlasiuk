import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [DatabaseModule, SubscriptionModule],
})
export class AppModule {}

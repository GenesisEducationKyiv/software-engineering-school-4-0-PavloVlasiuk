import { Module } from '@nestjs/common';
import { RateModule } from './modules/rate/rate.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

@Module({
  imports: [RateModule, SubscriptionModule],
})
export class AppModule {}

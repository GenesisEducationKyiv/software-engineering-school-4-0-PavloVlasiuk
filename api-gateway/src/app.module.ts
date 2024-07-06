import { Module } from '@nestjs/common';
import { RateModule } from './rate/rate.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AppConfigModule } from './config/app-config';

@Module({
  imports: [AppConfigModule, RateModule, SubscriptionModule],
})
export class AppModule {}

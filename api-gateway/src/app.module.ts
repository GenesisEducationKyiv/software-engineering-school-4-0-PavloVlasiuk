import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/app-config';
import { RateModule } from './rate/rate.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [AppConfigModule, RateModule, SubscriptionModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Subscription, SubscriptionSchema } from './schemas';
import { subscriptionProviders } from './subscription.providers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  providers: [...subscriptionProviders],
  exports: [...subscriptionProviders],
})
export class SubscriptionModule {}

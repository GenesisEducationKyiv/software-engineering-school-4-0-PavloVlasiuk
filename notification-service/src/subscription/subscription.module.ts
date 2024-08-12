import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Subscription, SubscriptionSchema } from './schemas';
import { SubscriptionController } from './subscription.controller';
import { subscriptionProviders } from './subscription.providers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [...subscriptionProviders],
  exports: [...subscriptionProviders],
})
export class SubscriptionModule {}

import { Module, Provider } from '@nestjs/common';

import { SUBSCRIPTION_REPOSITORY, SUBSCRIPTION_SERVICE } from './interfaces';
import { SubscriptionRepository } from './repositories';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { DatabaseModule } from '../database/database.module';

const SubscriptionRepositoryImpl: Provider = {
  provide: SUBSCRIPTION_REPOSITORY,
  useClass: SubscriptionRepository,
};

const SubscriptionServiceImpl: Provider = {
  provide: SUBSCRIPTION_SERVICE,
  useClass: SubscriptionService,
};

@Module({
  imports: [DatabaseModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionRepositoryImpl, SubscriptionServiceImpl],
  exports: [SubscriptionServiceImpl],
})
export class SubscriptionModule {}

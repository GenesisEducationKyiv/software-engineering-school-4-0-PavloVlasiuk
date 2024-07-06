import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SubscriptionRepository } from './repositories';
import { SubscriptionService } from './subscription.service';
import { SUBSCRIPTION_REPOSITORY, SUBSCRIPTION_SERVICE } from './interfaces';
import { SubscriptionController } from './subscription.controller';

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

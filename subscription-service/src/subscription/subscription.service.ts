import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import {
  SubscribeEmailRequestDto,
  UnsubscribeEmailRequestDto,
} from './dto/requests';
import { Subscription } from './entities';
import {
  AlreadySubscribedException,
  EntityNotFoundException,
} from './exceptions';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
  ISubscriptionService,
} from './interfaces';
import {
  ISubscriptionMetricsService,
  SUBSCRIPTION_METRICS_SERVICE,
} from '../metrics/interfaces';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @InjectPinoLogger(SubscriptionService.name)
    private readonly logger: PinoLogger,
    @Inject(SUBSCRIPTION_METRICS_SERVICE)
    private readonly metricsService: ISubscriptionMetricsService,
  ) {}

  async subscribe(data: SubscribeEmailRequestDto): Promise<void> {
    const { email } = data;

    this.logger.info(
      `Local(subscription microservice) - Subscribing email: ${email}`,
    );

    const alreadySubscribed =
      await this.subscriptionRepository.findByEmail(email);

    if (alreadySubscribed) throw new AlreadySubscribedException();

    await this.subscriptionRepository.createOrUpdate(email);

    this.metricsService.incSubscriptionCreatedCounter();
  }

  async getAllSubscribers(): Promise<Subscription[]> {
    return this.subscriptionRepository.findAll();
  }

  async unsubscribe(data: UnsubscribeEmailRequestDto): Promise<void> {
    const { email } = data;

    this.logger.info(
      `Local(subscription microservice) - Unsubscribing email: ${email}`,
    );

    const isSubscribed = await this.isSubscribed(email);

    if (!isSubscribed) throw new EntityNotFoundException('Subscription');

    await this.subscriptionRepository.deleteByEmail(email);

    this.metricsService.incSubscriptionDeletedCounter();
  }

  private async isSubscribed(email: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findByEmail(email);
  }
}

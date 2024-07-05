import { Controller, Inject } from '@nestjs/common';
import { ISubscriptionService, SUBSCRIPTION_SERVICE } from './interfaces';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { SubscribeEmailRequestDto } from './dto/requests';
import { SubscribersResponse } from './dto/responses';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  @GrpcMethod(SUBSCRIPTION_SERVICE)
  async subscribe(@Payload() subscribeEmailDto: SubscribeEmailRequestDto) {
    return await this.subscriptionService.subscribe(subscribeEmailDto);
  }

  @GrpcMethod(SUBSCRIPTION_SERVICE)
  async getAllSubscribers() {
    const subscribers = await this.subscriptionService.getAllSubscribers();

    return new SubscribersResponse(subscribers);
  }
}

import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import {
  SUBSCRIPTION_PACKAGE_NAME,
  SUBSCRIPTION_SERVICE_NAME,
  SubscribeEmailDto,
  Subscribers,
  SubscriptionServiceClient,
} from '../../../proto/dist/types/subscription';
import { Empty } from '../../../proto/dist/types/rate';

@Controller('subscription')
export class SubscriptionController implements OnModuleInit {
  private subscriptionService: SubscriptionServiceClient;

  constructor(
    @Inject(SUBSCRIPTION_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.subscriptionService =
      this.client.getService<SubscriptionServiceClient>(
        SUBSCRIPTION_SERVICE_NAME,
      );
  }

  @Post()
  subscribe(@Body() subscribeEmailDto: SubscribeEmailDto): Observable<Empty> {
    return this.subscriptionService.subscribe(subscribeEmailDto);
  }

  @Get()
  getAllSubscribers(): Observable<Subscribers> {
    return this.subscriptionService.getAllSubscribers(null);
  }
}

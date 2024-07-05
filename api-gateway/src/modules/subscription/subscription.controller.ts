import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SUBSCRIPTION_PACKAGE } from './types/subscription';
import { ClientGrpc } from '@nestjs/microservices';

class SubscribeEmailDto {
  email: string;
}

interface SubscriptionService {
  subscribe(subscribeEmailDto: SubscribeEmailDto): Observable<null>;
  getAllSubscribers({}): Observable<any>;
}

@Controller('subscription')
export class SubscriptionController implements OnModuleInit {
  private subscriptionService: SubscriptionService;

  constructor(
    @Inject(SUBSCRIPTION_PACKAGE) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.subscriptionService = this.client.getService<SubscriptionService>(
      'SubscriptionService',
    );
  }

  @Post()
  subscribe(@Body() subscribeEmailDto: SubscribeEmailDto) {
    return this.subscriptionService.subscribe(subscribeEmailDto);
  }

  @Get()
  getAllSubscribers() {
    return this.subscriptionService.getAllSubscribers(null);
  }
}

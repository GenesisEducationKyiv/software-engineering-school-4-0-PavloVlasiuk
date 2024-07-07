import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import {
  Empty,
  SUBSCRIPTION_PACKAGE_NAME,
  SUBSCRIPTION_SERVICE_NAME,
  Subscribers,
  SubscriptionServiceClient,
} from '../../../proto/dist/types/subscription';
import { SubscribeEmailRequestDto } from './dto/requests';

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
  subscribe(
    @Body() subscribeEmailDto: SubscribeEmailRequestDto,
  ): Observable<Empty> {
    return this.subscriptionService
      .subscribe(subscribeEmailDto)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Get()
  getAllSubscribers(): Observable<Subscribers> {
    return this.subscriptionService
      .getAllSubscribers(null)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }
}

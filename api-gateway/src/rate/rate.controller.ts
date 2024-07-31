import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';

import {
  RATE_PACKAGE_NAME,
  RATE_SERVICE_NAME,
  Rate,
  RateServiceClient,
} from '../../../proto/dist/types/rate';

@Controller('rate')
export class RateController implements OnModuleInit {
  private rateService: RateServiceClient;

  constructor(
    @Inject(RATE_PACKAGE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.rateService =
      this.client.getService<RateServiceClient>(RATE_SERVICE_NAME);
  }

  @Get()
  getCurrentRate(): Observable<Rate> {
    return this.rateService
      .getCurrentRate(null)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }
}

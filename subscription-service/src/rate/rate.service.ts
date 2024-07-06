import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  RATE_SERVICE_NAME,
  Rate,
  RateServiceClient,
} from '../../../proto/dist/types/rate';

@Injectable()
export class RateService implements OnModuleInit {
  private rateService: RateServiceClient;

  constructor(
    @Inject(RATE_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.rateService =
      this.client.getService<RateServiceClient>(RATE_SERVICE_NAME);
  }

  getCurrentRate(): Observable<Rate> {
    return this.rateService.getCurrentRate(null);
  }
}

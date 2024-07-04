import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { RATE_PACKAGE } from './types/rate';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface RateService {
  getCurrentRate({}): Observable<any>;
}

@Controller('rate')
export class RateController implements OnModuleInit {
  private rateService: RateService;

  constructor(
    @Inject(RATE_PACKAGE)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.rateService = this.client.getService<RateService>('RateService');
  }

  @Get()
  async getCurrentRate(): Promise<any> {
    return this.rateService.getCurrentRate(null);
  }
}

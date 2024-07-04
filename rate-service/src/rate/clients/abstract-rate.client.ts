import { HttpService } from '@nestjs/axios';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { AppConfigService } from '../../config/app-config.service';
import { RateClientException } from '../exceptions';
import { IExchangeRate } from '../interfaces';
import { IRateClient } from '../interfaces/rate-client.interface';

export abstract class AbstractRateClient implements IRateClient {
  private next: IRateClient;

  constructor(
    protected readonly httpService: HttpService,
    protected readonly appConfigService: AppConfigService,
    @InjectPinoLogger()
    protected readonly logger: PinoLogger,
  ) {}

  setNext(client: IRateClient): IRateClient {
    this.next = client;

    return client;
  }

  async getRate(): Promise<IExchangeRate> {
    if (!this.next) throw new RateClientException();

    return this.next.getRate();
  }
}

import { HttpService } from '@nestjs/axios';

import { RateClientException } from '../exceptions';
import { IExchangeRate } from '../interfaces';
import { IRateClient } from '../interfaces/rate-client.interface';
import { AXIOS_TIMEOUT } from '../rate.constants';

export abstract class AbstractRateClient implements IRateClient {
  private next: IRateClient;

  constructor(protected readonly httpService: HttpService) {
    this.httpService.axiosRef.defaults.timeout = AXIOS_TIMEOUT;
  }

  setNext(client: IRateClient): IRateClient {
    this.next = client;

    return client;
  }

  async getRate(): Promise<IExchangeRate> {
    if (!this.next) throw new RateClientException();

    return this.next.getRate();
  }
}

import { RateClientException } from '../exceptions';
import { IExchangeRate } from '../interfaces';
import { IRateClient } from '../interfaces/rate-client.interface';

export abstract class AbstractRateClient implements IRateClient {
  private next: IRateClient;

  setNext(client: IRateClient): IRateClient {
    this.next = client;

    return client;
  }

  async getRate(): Promise<IExchangeRate> {
    if (!this.next) throw new RateClientException();

    return this.next.getRate();
  }
}

import { IExchangeRate } from './exchange-rate.interface';

export interface IRateClient {
  setNext(client: IRateClient): IRateClient;
  getRate(): Promise<IExchangeRate>;
}

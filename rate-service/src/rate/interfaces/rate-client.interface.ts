import { IExchangeRate } from './exchange-rate.interface';

export const RATE_CLIENT = 'RateClient';

export interface IRateClient {
  setNext(client: IRateClient): IRateClient;
  getRate(): Promise<IExchangeRate>;
}

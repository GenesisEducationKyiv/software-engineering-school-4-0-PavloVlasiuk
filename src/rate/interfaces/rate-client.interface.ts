import { IExchangeRate } from './exchange-rate.interface';

export const RATE_CLIENT_TOKEN = 'RateClient';

export interface IRateClient {
  setNext(client: IRateClient): IRateClient;
  getRate(): Promise<IExchangeRate>;
}

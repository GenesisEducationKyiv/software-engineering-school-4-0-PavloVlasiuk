import { IExchangeRate } from './exchange-rate.interface';

export const RATE_SERVICE = 'RateService';

export interface IRateService {
  getCurrentRate(): Promise<IExchangeRate>;
}

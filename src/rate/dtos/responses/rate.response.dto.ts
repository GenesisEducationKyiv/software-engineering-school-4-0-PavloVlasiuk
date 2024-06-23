import { Exclude, Expose } from 'class-transformer';

import { IExchangeRate } from '../../../rate/interfaces';

@Exclude()
export class RateResponseDto {
  @Expose()
  rate: string;

  @Expose()
  exchangeDate: string;

  constructor(rate: IExchangeRate) {
    Object.assign(this, rate);

    this.exchangeDate = new Date(rate.exchangeDate).toISOString();
  }
}

import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractRateClient } from './abstract-rate.client';
import { RateClientException } from '../exceptions';
import { IExchangeRate } from '../interfaces';
import { DOLLAR_CODE, SECOND } from '../rate.constants';

export interface IGetMonobankRate {
  currencyCodeA: number;
  currencyCodeB: number;
  date: number;
  rateSell: number;
  rateBuy: number;
  rateCross: number;
}

export class MonobankClient extends AbstractRateClient {
  private readonly apiUrl = 'https://api.monobank.ua/bank/currency';

  async getRate(): Promise<IExchangeRate> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Array<IGetMonobankRate>>(this.apiUrl).pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw new RateClientException();
          }),
        ),
      );

      const currency = data.find((c) => c.currencyCodeA === DOLLAR_CODE);

      if (!currency) throw new RateClientException();

      return {
        rate: currency.rateSell,
        exchangeDate: new Date(currency.date * SECOND).toString(),
      };
    } catch (e) {
      return super.getRate();
    }
  }
}

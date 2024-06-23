import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractRateClient } from './abstract-rate.client';
import { RateClientException } from '../exceptions';
import { IExchangeRate } from '../interfaces';

export interface IGetCurrencyAPIRate {
  date: string;
  usd: {
    [key: string]: number;
  };
}

export class CurrencyAPIClient extends AbstractRateClient {
  private readonly apiUrl =
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

  async getRate(): Promise<IExchangeRate> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IGetCurrencyAPIRate>(this.apiUrl).pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw new RateClientException();
          }),
        ),
      );

      return {
        rate: data.usd.uah,
        exchangeDate: data.date,
      };
    } catch (e) {
      return super.getRate();
    }
  }
}

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractRateClient } from './abstract-rate.client';
import { RateClientException } from '../exceptions';
import { IExchangeRate } from '../interfaces';

export interface IGetCurrencybeaconRate {
  meta: object;
  response: object;
  date: string;
  base: string;
  rates: {
    UAH: number;
  };
}

@Injectable()
export class CurrencybeaconClient extends AbstractRateClient {
  private readonly apiUrl =
    'https://api.currencybeacon.com/v1/latest?api_key=3mmxKhizwvv45RgChliXaxUIY3aSkKO1&base=USD&symbols=UAH';

  constructor(readonly httpService: HttpService) {
    super(httpService);
  }

  async getRate(): Promise<IExchangeRate> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IGetCurrencybeaconRate>(this.apiUrl).pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw new RateClientException();
          }),
        ),
      );

      return {
        rate: data.rates.UAH,
        exchangeDate: data.date,
      };
    } catch (e) {
      return super.getRate();
    }
  }
}

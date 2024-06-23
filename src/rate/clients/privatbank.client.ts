import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractRateClient } from './abstract-rate.client';
import { RateClientException } from '../exceptions';
import { IExchangeRate } from '../interfaces';
import { DOLLAR_ABBREVIATION } from '../rate.constants';

export interface IGetPrivatbankRate {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
}

export class PrivatbankClient extends AbstractRateClient {
  private readonly apiUrl =
    'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5';

  async getRate(): Promise<IExchangeRate> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Array<IGetPrivatbankRate>>(this.apiUrl).pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw new RateClientException();
          }),
        ),
      );

      const currency = data.find((c) => c.ccy === DOLLAR_ABBREVIATION);

      if (!currency) throw new RateClientException();

      return {
        rate: +currency.sale,
        exchangeDate: new Date().toISOString(),
      };
    } catch (e) {
      return super.getRate();
    }
  }
}

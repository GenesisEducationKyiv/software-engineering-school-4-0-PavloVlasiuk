import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractRateClient } from './abstract-rate.client';
import { RateClientException } from '../exceptions';
import { IExchangeRate } from '../interfaces';

export interface IGetNBURate {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

export class NBUClient extends AbstractRateClient {
  private readonly apiUrl =
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?valcode=USD&json';

  async getRate(): Promise<IExchangeRate> {
    try {
      const {
        data: [currency],
      } = await firstValueFrom(
        this.httpService.get<Array<IGetNBURate>>(this.apiUrl).pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw new RateClientException();
          }),
        ),
      );

      return {
        rate: currency.rate,
        exchangeDate: currency.exchangedate.split('.').reverse().join('-'),
      };
    } catch (e) {
      return super.getRate();
    }
  }
}

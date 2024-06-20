import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

import { ExchangeRateAPIException } from './exceptions';
import { IExchangeRate, IGetExchangeRate } from './interfaces';
import { API_URL } from './rate.constants';

@Injectable()
export class RateService {
  constructor(private readonly httpService: HttpService) {}

  async getCurrentRate(): Promise<IExchangeRate> {
    const {
      data: [currency],
    } = await firstValueFrom(
      this.httpService.get<Array<IGetExchangeRate>>(API_URL).pipe(
        catchError((e) => {
          console.error(e);
          throw new ExchangeRateAPIException();
        }),
      ),
    );

    return {
      rate: currency.rate,
      exchangedate: currency.exchangedate,
    };
  }
}

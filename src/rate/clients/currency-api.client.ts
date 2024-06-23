import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractRateClient } from './abstract-rate.client';
import { AppConfigService } from '../../config/app-config.service';
import { RateClientException } from '../exceptions';
import { IExchangeRate } from '../interfaces';

export interface IGetCurrencyAPIRate {
  date: string;
  usd: {
    [key: string]: number;
  };
}

@Injectable()
export class CurrencyAPIClient extends AbstractRateClient {
  constructor(
    readonly httpService: HttpService,
    readonly appConfigService: AppConfigService,
  ) {
    super(httpService, appConfigService);
  }

  async getRate(): Promise<IExchangeRate> {
    const apiUrl = this.appConfigService.get<string>(
      'rate.clients.currencyApiUrl',
    );

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IGetCurrencyAPIRate>(apiUrl).pipe(
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

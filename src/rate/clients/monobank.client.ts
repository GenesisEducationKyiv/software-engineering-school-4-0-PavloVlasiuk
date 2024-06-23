import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractRateClient } from './abstract-rate.client';
import { AppConfigService } from '../../config/app-config.service';
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

@Injectable()
export class MonobankClient extends AbstractRateClient {
  constructor(
    readonly httpService: HttpService,
    readonly appConfigService: AppConfigService,
  ) {
    super(httpService, appConfigService);
  }

  async getRate(): Promise<IExchangeRate> {
    const apiUrl = this.appConfigService.get<string>(
      'rate.clients.monobankApiUrl',
    );

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Array<IGetMonobankRate>>(apiUrl).pipe(
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

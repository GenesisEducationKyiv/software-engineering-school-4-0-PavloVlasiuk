import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractRateClient } from './abstract-rate.client';
import { AppConfigService } from '../../config/app-config.service';
import { RateClientException } from '../exceptions';
import { IExchangeRate } from '../interfaces';
import { DOLLAR_ABBREVIATION } from '../rate.constants';

export interface IGetPrivatbankRate {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
}

@Injectable()
export class PrivatbankClient extends AbstractRateClient {
  constructor(
    readonly httpService: HttpService,
    readonly appConfigService: AppConfigService,
  ) {
    super(httpService, appConfigService);
  }

  async getRate(): Promise<IExchangeRate> {
    const apiUrl = this.appConfigService.get<string>(
      'rate.clients.privatbankApiUrl',
    );

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Array<IGetPrivatbankRate>>(apiUrl).pipe(
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

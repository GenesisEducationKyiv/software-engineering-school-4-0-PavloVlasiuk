import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { PinoLogger } from 'nestjs-pino';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractRateClient } from './abstract-rate.client';
import { AppConfigService } from '../../config/app-config.service';
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
  constructor(
    readonly httpService: HttpService,
    readonly appConfigService: AppConfigService,
    readonly logger: PinoLogger,
  ) {
    super(httpService, appConfigService, logger);
  }

  async getRate(): Promise<IExchangeRate> {
    const apiUrl = this.appConfigService.get<string>(
      'rate.clients.currencybeaconApiUrl',
    );

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IGetCurrencybeaconRate>(apiUrl).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new RateClientException();
          }),
        ),
      );

      this.logger.info(
        `api.currencybeacon.com - Response: ${JSON.stringify({ data })}`,
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

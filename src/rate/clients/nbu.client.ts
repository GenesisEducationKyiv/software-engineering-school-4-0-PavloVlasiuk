import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractRateClient } from './abstract-rate.client';
import { AppConfigService } from '../../config/app-config.service';
import { RateClientException } from '../exceptions';
import { IExchangeRate } from '../interfaces';

export interface IGetNBURate {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

@Injectable()
export class NBUClient extends AbstractRateClient {
  constructor(
    readonly httpService: HttpService,
    readonly appConfigService: AppConfigService,
  ) {
    super(httpService, appConfigService);
  }

  async getRate(): Promise<IExchangeRate> {
    const apiUrl = this.appConfigService.get<string>('rate.clients.NBUApiUrl');

    try {
      const {
        data: [currency],
      } = await firstValueFrom(
        this.httpService.get<Array<IGetNBURate>>(apiUrl).pipe(
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

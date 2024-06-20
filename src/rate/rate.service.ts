import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { IExchangeRate, IGetExchangeRate } from './interfaces';
import { API_URL } from './rate.constants';

@Injectable()
export class RateService {
  constructor(private readonly httpService: HttpService) {}

  async getCurrentRate(): Promise<IExchangeRate> {
    const {
      data: [currency],
    } = await firstValueFrom(
      this.httpService.get<Array<IGetExchangeRate>>(API_URL),
    );

    return {
      rate: currency.rate,
      exchangedate: currency.exchangedate,
    };
  }
}

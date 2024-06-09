import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IExchangeRate } from './interfaces/exchange-rate.interface';
import { API_URL } from './rate.constants';
import { firstValueFrom } from 'rxjs';
import { CurrentRateResponse } from './responses/current-rate.response';

@Injectable()
export class RateService {
  constructor(private readonly httpService: HttpService) {}

  async getCurrentRate(): Promise<CurrentRateResponse> {
    const {
      data: [currency],
    } = await firstValueFrom(
      this.httpService.get<Array<IExchangeRate>>(API_URL),
    );

    return {
      rate: currency.rate,
      exchangedate: currency.exchangedate,
    };
  }
}

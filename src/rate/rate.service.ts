import { Injectable } from '@nestjs/common';

import {
  NBUClient,
  PrivatbankClient,
  MonobankClient,
  CurrencybeaconClient,
  CurrencyAPIClient,
} from './clients';
import { IExchangeRate } from './interfaces';
import { IRateClient } from './interfaces/rate-client.interface';

@Injectable()
export class RateService {
  private rateClient: IRateClient;

  constructor() {
    this.rateClient = new NBUClient();

    this.rateClient
      .setNext(new PrivatbankClient())
      .setNext(new MonobankClient())
      .setNext(new CurrencybeaconClient())
      .setNext(new CurrencyAPIClient());
  }

  async getCurrentRate(): Promise<IExchangeRate> {
    return this.rateClient.getRate();
  }
}

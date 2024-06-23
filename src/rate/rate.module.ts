import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import {
  CurrencyAPIClient,
  CurrencybeaconClient,
  MonobankClient,
  NBUClient,
  PrivatbankClient,
} from './clients';
import { RATE_CLIENT_TOKEN } from './interfaces';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';

@Module({
  imports: [HttpModule],
  controllers: [RateController],
  providers: [
    RateService,
    NBUClient,
    PrivatbankClient,
    MonobankClient,
    CurrencybeaconClient,
    CurrencyAPIClient,
    {
      provide: RATE_CLIENT_TOKEN,
      useFactory: (
        nbuClient: NBUClient,
        privatbankClient: PrivatbankClient,
        monobankClient: MonobankClient,
        currencybeaconClient: CurrencybeaconClient,
        currencyAPIClient: CurrencyAPIClient,
      ) => {
        nbuClient
          .setNext(privatbankClient)
          .setNext(monobankClient)
          .setNext(currencybeaconClient)
          .setNext(currencyAPIClient);

        return nbuClient;
      },
      inject: [
        NBUClient,
        PrivatbankClient,
        MonobankClient,
        CurrencybeaconClient,
        CurrencyAPIClient,
      ],
    },
  ],
  exports: [RateService],
})
export class RateModule {}

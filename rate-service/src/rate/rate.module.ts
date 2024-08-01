import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';

import {
  CurrencyAPIClient,
  CurrencybeaconClient,
  MonobankClient,
  NBUClient,
  PrivatbankClient,
} from './clients';
import { RATE_CLIENT, RATE_SERVICE } from './interfaces';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { AppConfigModule } from '../config/app-config';
import { AppConfigService } from '../config/app-config/app-config.service';
import { MetricsModule } from '../metrics/metrics.module';

const RateServiceImpl: Provider = {
  provide: RATE_SERVICE,
  useClass: RateService,
};

const RateClientImpl: Provider = {
  provide: RATE_CLIENT,
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
};

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (config: AppConfigService) => ({
        timeout: config.get<number>('http.request.timeout'),
      }),
      inject: [AppConfigService],
    }),
    AppConfigModule,
    MetricsModule,
  ],
  controllers: [RateController],
  providers: [
    RateServiceImpl,
    NBUClient,
    PrivatbankClient,
    MonobankClient,
    CurrencybeaconClient,
    CurrencyAPIClient,
    RateClientImpl,
  ],
  exports: [RateServiceImpl],
})
export class RateModule {}

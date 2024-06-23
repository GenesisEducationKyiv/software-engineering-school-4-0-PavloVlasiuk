import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'nestjs-pino';
import { of, throwError } from 'rxjs';

import { IGetNBURate, NBUClient } from './clients';
import { RateClientException } from './exceptions';
import { IExchangeRate, IRateClient, RATE_CLIENT_TOKEN } from './interfaces';
import { RateService } from './rate.service';
import { AppConfigModule } from '../config/app-config.module';

describe('RateService', () => {
  let rateService: RateService;
  let rateClient: IRateClient;
  let httpService: HttpService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, AppConfigModule, LoggerModule.forRoot()],
      providers: [
        RateService,
        NBUClient,
        {
          provide: RATE_CLIENT_TOKEN,
          useFactory(nbuClient: NBUClient) {
            return nbuClient;
          },
          inject: [NBUClient],
        },
      ],
    })
      .useMocker((token) => {
        if (token instanceof HttpService) {
          return { get: jest.fn() };
        }

        return {};
      })
      .compile();

    rateService = testingModule.get<RateService>(RateService);
    rateClient = testingModule.get<IRateClient>(RATE_CLIENT_TOKEN);
    httpService = testingModule.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(rateService).toBeDefined();
  });

  describe('getCurrentRate', () => {
    it('should return current rate usd to uah and exchange date', async () => {
      const data: Array<IGetNBURate> = [
        {
          r030: 840,
          txt: 'Долар США',
          rate: 39.17,
          cc: 'USD',
          exchangedate: '02.05.2024',
        },
      ];

      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data,
          headers: {},
          config: {
            url: 'http://localhost:3000/mock',
            headers: undefined,
          },
          status: 200,
          statusText: 'OK',
        }),
      );

      jest.spyOn(rateClient, 'getRate');

      const rate = await rateService.getCurrentRate();

      const response: IExchangeRate = {
        rate: 39.17,
        exchangeDate: new Date('2024-05-02').toISOString(),
      };

      expect(httpService.get).toHaveBeenCalledTimes(1);

      expect(rateClient.getRate).toHaveBeenCalledTimes(1);

      expect(rate).toEqual(response);
    });

    it('should throw RateClientException cause all client are not able to provide exchange rate', async () => {
      const errorResponse = {
        response: {
          status: 429,
          data: {
            message: 'Too Many Requests',
          },
        },
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => errorResponse));

      let exception: any;

      try {
        await rateService.getCurrentRate();
      } catch (ex: any) {
        exception = ex;
      }

      expect(exception).toBeInstanceOf(RateClientException);
    });
  });
});

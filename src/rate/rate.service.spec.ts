import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { ExchangeRateAPIException } from './exceptions';
import { IExchangeRate, IGetExchangeRate } from './interfaces';
import { RateService } from './rate.service';

describe('RateService', () => {
  let rateService: RateService;
  let httpService: HttpService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        RateService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn((data) => data),
          },
        },
      ],
    }).compile();

    rateService = testingModule.get<RateService>(RateService);
    httpService = testingModule.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(rateService).toBeDefined();
  });

  describe('getCurrentRate', () => {
    it('should return current rate usd to uah and exchange date', async () => {
      const data: Array<IGetExchangeRate> = [
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

      const currentRate = await rateService.getCurrentRate();

      const response: IExchangeRate = {
        rate: 39.17,
        exchangedate: '02.05.2024',
      };

      expect(httpService.get).toHaveBeenCalledTimes(1);

      expect(currentRate).toEqual(response);
    });

    it('should throw ExhangeRateAPIException cause error from thir party service', async () => {
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

      expect(exception).toBeInstanceOf(ExchangeRateAPIException);
    });
  });
});

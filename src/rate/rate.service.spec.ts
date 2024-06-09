import { Test, TestingModule } from '@nestjs/testing';
import { RateService } from './rate.service';
import { HttpService } from '@nestjs/axios';
import { IExchangeRate } from './interfaces/exchange-rate.interface';
import { of } from 'rxjs';
import { CurrentRateResponse } from './responses/current-rate.response';

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
      const data: Array<IExchangeRate> = [
        {
          r030: 840,
          txt: 'Долар США',
          rate: 39.17,
          cc: 'USD',
          exchangedate: '02.05.2024',
        },
      ];

      const spy = jest.spyOn(httpService, 'get').mockReturnValue(
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

      const response: CurrentRateResponse = {
        rate: 39.17,
        exchangedate: '02.05.2024',
      };

      expect(spy).toHaveBeenCalledTimes(1);

      expect(currentRate).toEqual(response);
    });
  });
});

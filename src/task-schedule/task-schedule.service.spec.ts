import { Test, TestingModule } from '@nestjs/testing';

import { TaskScheduleService } from './task-schedule.service';
import { EmailService } from '../email/services/email.service';
import { IExchangeRate } from '../rate/interfaces';
import { RateService } from '../rate/rate.service';

describe('TaskScheduleService', () => {
  let taskScheduleService: TaskScheduleService;
  let rateService: RateService;
  let emailService: EmailService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        TaskScheduleService,
        {
          provide: RateService,
          useValue: {
            getCurrentRate: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendRate: jest.fn(),
          },
        },
      ],
    }).compile();

    taskScheduleService =
      testingModule.get<TaskScheduleService>(TaskScheduleService);
    rateService = testingModule.get<RateService>(RateService);
    emailService = testingModule.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(taskScheduleService).toBeDefined();
  });

  describe('sendCurrentRateEmail', () => {
    it('should send current rate to subscribers', async () => {
      const currency: IExchangeRate = {
        rate: 39.414,
        exchangeDate: '16.06.2024',
      };

      jest.spyOn(rateService, 'getCurrentRate').mockResolvedValue(currency);

      jest.spyOn(emailService, 'sendRate').mockResolvedValue(undefined);

      const response = await taskScheduleService.sendCurrentRateEmail();

      expect(response).toBeUndefined();

      expect(rateService.getCurrentRate).toHaveBeenCalledTimes(1);

      expect(emailService.sendRate).toHaveBeenCalledTimes(1);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { ITaskScheduleService, TASK_SCHEDULE_SERVICE } from './interfaces';
import { TaskScheduleService } from './task-schedule.service';
import { EMAIL_SERVICE, IEmailService } from '../email/interfaces';
import { IExchangeRate, IRateService, RATE_SERVICE } from '../rate/interfaces';

describe('TaskScheduleService', () => {
  let taskScheduleService: ITaskScheduleService;
  let rateService: IRateService;
  let emailService: IEmailService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: TASK_SCHEDULE_SERVICE, useClass: TaskScheduleService },
        {
          provide: RATE_SERVICE,
          useValue: {
            getCurrentRate: jest.fn(),
          },
        },
        {
          provide: EMAIL_SERVICE,
          useValue: {
            sendRate: jest.fn(),
          },
        },
      ],
    }).compile();

    taskScheduleService = testingModule.get<ITaskScheduleService>(
      TASK_SCHEDULE_SERVICE,
    );
    rateService = testingModule.get<IRateService>(RATE_SERVICE);
    emailService = testingModule.get<IEmailService>(EMAIL_SERVICE);
  });

  it('should be defined', () => {
    expect(taskScheduleService).toBeDefined();
  });

  describe('sendCurrentRateEmail', () => {
    it('should send current rate to subscribers', async () => {
      const currency: IExchangeRate = {
        rate: 39.414,
        exchangeDate: new Date('2024-06-16').toISOString(),
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

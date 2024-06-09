import { RateService } from '../rate/rate.service';
import { TaskScheduleService } from './task-schedule.service';
import { EmailService } from '../email/email.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Email } from '@prisma/client';
import { CurrentRateResponse } from '../rate/responses/current-rate.response';
import { EMAIL_SUBJECT } from './task-schedule.constants';

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
            getAllSubscribers: jest.fn(),
            sendTemplatedEmail: jest.fn(),
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

  describe('sendCurrentRate', () => {
    it('should send current rate to all subscribers', async () => {
      const currency: CurrentRateResponse = {
        rate: 39.414,
        exchangedate: '15.05.2024',
      };

      const subscribers: Array<Email> = [
        {
          id: '60f96e72-66e2-476d-ac4b-d46114d17e3a',
          email: 'adripp0@gmail.com',
          createdAt: new Date(2024, 2, 10),
          updatedAt: new Date(2024, 2, 10),
        },
        {
          id: '2fa7775d-a10e-4b97-9cfc-14cdc07a178c',
          email: 'abarizeret1@gmail.com',
          createdAt: new Date(2024, 2, 22),
          updatedAt: new Date(2024, 2, 22),
        },
        {
          id: '29e6aa23-6f9b-42f2-b3ec-6bbaaf8cdce6',
          email: 'bgemlett2@gmail.com',
          createdAt: new Date(2024, 4, 18),
          updatedAt: new Date(2024, 4, 18),
        },
      ];

      const spyRateService = jest
        .spyOn(rateService, 'getCurrentRate')
        .mockResolvedValue(currency);

      const spyGetAllSubscribers = jest
        .spyOn(emailService, 'getAllSubscribers')
        .mockResolvedValue(subscribers);

      const spySendtemplatedEmail = jest
        .spyOn(emailService, 'sendTemplatedEmail')
        .mockResolvedValue(undefined);

      const response = await taskScheduleService.sendCurrentRate();

      expect(response).toBeUndefined();

      expect(spyRateService).toHaveBeenCalledTimes(1);

      expect(spyGetAllSubscribers).toHaveBeenCalledTimes(1);

      expect(spySendtemplatedEmail).toHaveBeenCalledTimes(subscribers.length);

      for (const subscriber of subscribers) {
        expect(spySendtemplatedEmail).toHaveBeenCalledWith({
          to: subscriber.email,
          subject: EMAIL_SUBJECT,
          context: {
            rate: currency.rate,
            date: new Date().toDateString(),
          },
        });
      }
    });
  });
});

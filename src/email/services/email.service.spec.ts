import { Test, TestingModule } from '@nestjs/testing';
import { Email } from '@prisma/client';

import { EmailService } from './email.service';
import { IExchangeRate } from '../../rate/interfaces';
import { SubscribeEmailDto } from '../dtos/subscribe-email.dto';
import { AlreadySubscribedException } from '../exceptions';
import {
  EMAIL_REPOSITORY,
  EMAIL_SERVICE,
  IEmailRepository,
  IEmailService,
  IMailingService,
  MAILING_SERVICE,
} from '../interfaces';

describe('EmailService', () => {
  let emailService: IEmailService;
  let emailRepository: IEmailRepository;
  let mailingService: IMailingService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: EMAIL_SERVICE, useClass: EmailService },
        {
          provide: EMAIL_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: MAILING_SERVICE,
          useValue: {
            sendTemplatedEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    emailService = testingModule.get<IEmailService>(EMAIL_SERVICE);
    emailRepository = testingModule.get<IEmailRepository>(EMAIL_REPOSITORY);
    mailingService = testingModule.get<IMailingService>(MAILING_SERVICE);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  describe('subscribe', () => {
    it('should create new subscriber', async () => {
      const subscribeEmailDto: SubscribeEmailDto = {
        email: 'test.testovych@gmail.com',
      };

      jest.spyOn(emailRepository, 'findByEmail').mockResolvedValue(null);

      await emailService.subscribe(subscribeEmailDto);

      expect(emailRepository.findByEmail).toHaveBeenCalledWith(
        subscribeEmailDto.email,
      );
      expect(emailRepository.findByEmail).toHaveBeenCalledTimes(1);

      expect(emailRepository.create).toHaveBeenCalledWith(
        subscribeEmailDto.email,
      );
      expect(emailRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw AlreadySubscribedException', async () => {
      const subscribeEmailDto: SubscribeEmailDto = {
        email: 'test.testovych@gmail.com',
      };

      jest.spyOn(emailRepository, 'findByEmail').mockResolvedValue({
        id: 'uuid',
        email: subscribeEmailDto.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      let exception: any;

      try {
        await emailService.subscribe(subscribeEmailDto);
      } catch (ex: any) {
        exception = ex;
      }

      expect(exception).toBeInstanceOf(AlreadySubscribedException);

      expect(emailRepository.findByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendRate', () => {
    it('should send current rate to all subscribers', async () => {
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

      const currency: IExchangeRate = {
        rate: 37.414,
        exchangeDate: new Date('2024-06-23').toISOString(),
      };

      jest.spyOn(emailRepository, 'findAll').mockResolvedValue(subscribers);

      jest
        .spyOn(mailingService, 'sendTemplatedEmail')
        .mockResolvedValue(undefined);

      await emailService.sendRate(currency);

      expect(emailRepository.findAll).toHaveBeenCalledTimes(1);

      expect(mailingService.sendTemplatedEmail).toHaveBeenCalledTimes(
        subscribers.length,
      );

      for (const { email } of subscribers) {
        expect(mailingService.sendTemplatedEmail).toHaveBeenCalledWith({
          to: email,
          context: {
            rate: currency.rate,
            date: new Date().toDateString(),
          },
        });
      }
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { Email } from '@prisma/client';

import { EmailService } from './email.service';
import { NodeMailerService } from './node-mailer.service';
import { AlreadySubscribedException } from '../../common/exceptions';
import { EmailRepository } from '../../database/repositories/email.repository';
import { IExchangeRate } from '../../rate/interfaces';
import { SubscribeEmailDto } from '../dtos/subscribe-email.dto';

describe('EmailService', () => {
  let emailService: EmailService;
  let emailRepository: EmailRepository;
  let nodeMailerService: NodeMailerService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: EmailRepository,
          useValue: {
            find: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: NodeMailerService,
          useValue: {
            sendTemplatedEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    emailService = testingModule.get<EmailService>(EmailService);
    emailRepository = testingModule.get<EmailRepository>(EmailRepository);
    nodeMailerService = testingModule.get<NodeMailerService>(NodeMailerService);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  describe('subscribe', () => {
    it('should create new subscriber', async () => {
      const subscribeEmailDto: SubscribeEmailDto = {
        email: 'test.testovych@gmail.com',
      };

      jest.spyOn(emailRepository, 'find').mockResolvedValue(null);

      await emailService.subscribe(subscribeEmailDto);

      expect(emailRepository.find).toHaveBeenCalledWith(subscribeEmailDto);
      expect(emailRepository.find).toHaveBeenCalledTimes(1);

      expect(emailRepository.create).toHaveBeenCalledWith(subscribeEmailDto);
      expect(emailRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw AlreadySubscribedException', async () => {
      const subscribeEmailDto: SubscribeEmailDto = {
        email: 'test.testovych@gmail.com',
      };

      jest.spyOn(emailRepository, 'find').mockResolvedValue({
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

      expect(emailRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendCurrentRate', () => {
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
        exchangedate: '15.05.2024',
      };

      jest.spyOn(emailRepository, 'findMany').mockResolvedValue(subscribers);

      jest
        .spyOn(nodeMailerService, 'sendTemplatedEmail')
        .mockResolvedValue(undefined);

      await emailService.sendCurrentRate(currency);

      expect(emailRepository.findMany).toHaveBeenCalledTimes(1);

      expect(nodeMailerService.sendTemplatedEmail).toHaveBeenCalledTimes(
        subscribers.length,
      );

      for (const { email } of subscribers) {
        expect(nodeMailerService.sendTemplatedEmail).toHaveBeenCalledWith({
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

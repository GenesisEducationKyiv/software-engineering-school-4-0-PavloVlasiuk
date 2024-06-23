import { Test } from '@nestjs/testing';

import { EmailService } from './email.service';
import { DatabaseModule } from '../../database/database.module';
import { PrismaService } from '../../database/prisma.service';
import { IExchangeRate } from '../../rate/interfaces';
import { SubscribeEmailDto } from '../dtos/subscribe-email.dto';
import { AlreadySubscribedException } from '../exceptions';
import {
  IMailingService,
  MAILING_SERVICE,
} from '../interfaces/mailing-service.interface';

describe('EmailService', () => {
  const subscribers: SubscribeEmailDto[] = [
    {
      email: 'first@gmail.com',
    },
    {
      email: 'second@gmail.com',
    },
    {
      email: 'third@gmail.com',
    },
  ];

  let emailService: EmailService;
  let mailingService: IMailingService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        EmailService,
        {
          provide: MAILING_SERVICE,
          useValue: {
            sendTemplatedEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    emailService = testingModule.get<EmailService>(EmailService);
    mailingService = testingModule.get<IMailingService>(MAILING_SERVICE);
    prisma = testingModule.get<PrismaService>(PrismaService);

    await prisma.email.createMany({
      data: subscribers,
    });
  });

  afterAll(async () => {
    await prisma.email.deleteMany();
  });

  describe('subscribe', () => {
    it('should create a new subscriber in the database', async () => {
      const subscribeEmailDto: SubscribeEmailDto = {
        email: 'new.subscriber@gmail.com',
      };

      await emailService.subscribe(subscribeEmailDto);

      const subscriber = await prisma.email.findFirst({
        where: { email: subscribeEmailDto.email },
      });

      expect(subscriber.email).toBe(subscribeEmailDto.email);
    });

    it('should find subsriber in the database and throw AlreadySubscribedException', async () => {
      const existingSubscriber: SubscribeEmailDto = {
        email: 'first@gmail.com',
      };

      let exception: any;

      try {
        await emailService.subscribe(existingSubscriber);
      } catch (e: any) {
        exception = e;
      }

      expect(exception).toBeInstanceOf(AlreadySubscribedException);
    });
  });

  describe('sendRate', () => {
    it('should get all subscribers from database', async () => {
      const exchangeRate: IExchangeRate = {
        rate: 40.22,
        exchangeDate: new Date('2024-06-16').toISOString(),
      };

      await emailService.sendRate(exchangeRate);

      for (const { email } of subscribers) {
        expect(mailingService.sendTemplatedEmail).toHaveBeenCalledWith({
          to: email,
          context: {
            rate: exchangeRate.rate,
            date: new Date().toDateString(),
          },
        });
      }
    });
  });
});

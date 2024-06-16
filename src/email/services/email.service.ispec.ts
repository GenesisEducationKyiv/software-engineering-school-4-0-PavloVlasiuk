import { Test } from '@nestjs/testing';

import { EmailService } from './email.service';
import { NodeMailerService } from './node-mailer.service';
import { DatabaseModule } from '../../database/database.module';
import { PrismaService } from '../../database/prisma.service';
import { IExchangeRate } from '../../rate/interfaces';
import { SubscribeEmailDto } from '../dtos/subscribe-email.dto';
import { AlreadySubscribedException } from '../exceptions';

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
  let nodeMailerService: NodeMailerService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        EmailService,
        {
          provide: NodeMailerService,
          useValue: {
            sendTemplatedEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    emailService = testingModule.get<EmailService>(EmailService);
    nodeMailerService = testingModule.get<NodeMailerService>(NodeMailerService);
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

  describe('sendCurrentRate', () => {
    it('should get all subscribers from database', async () => {
      const exchangeRate: IExchangeRate = {
        rate: 40.22,
        exchangedate: '2024.06.16',
      };

      await emailService.sendCurrentRate(exchangeRate);

      for (const { email } of subscribers) {
        expect(nodeMailerService.sendTemplatedEmail).toHaveBeenCalledWith({
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

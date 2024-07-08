import { Test } from '@nestjs/testing';
import { SubscribeEmailRequestDto } from './dto/requests';
import {
  ISubscriptionService,
  SUBSCRIPTION_REPOSITORY,
  SUBSCRIPTION_SERVICE,
} from './interfaces';
import { DatabaseModule, PrismaService } from '../database';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './repositories';
import { AlreadySubscribedException } from './exceptions';

describe('EmailService', () => {
  const subscribers: SubscribeEmailRequestDto[] = [
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

  let subscriptionService: ISubscriptionService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        { provide: SUBSCRIPTION_SERVICE, useClass: SubscriptionService },
        { provide: SUBSCRIPTION_REPOSITORY, useClass: SubscriptionRepository },
      ],
    }).compile();

    subscriptionService =
      testingModule.get<ISubscriptionService>(SUBSCRIPTION_SERVICE);
    prisma = testingModule.get<PrismaService>(PrismaService);

    await prisma.subscription.createMany({
      data: subscribers,
    });
  });

  afterAll(async () => {
    await prisma.subscription.deleteMany();
  });

  describe('subscribe', () => {
    it('should create a new subscriber in the database', async () => {
      const subscribeEmailDto: SubscribeEmailRequestDto = {
        email: 'new.subscriber@gmail.com',
      };

      await subscriptionService.subscribe(subscribeEmailDto);

      const subscriber = await prisma.subscription.findFirst({
        where: { email: subscribeEmailDto.email },
      });

      expect(subscriber.email).toBe(subscribeEmailDto.email);
    });

    it('should find subscriber in the database and throw AlreadySubscribedException', async () => {
      const existingSubscriber: SubscribeEmailRequestDto = {
        email: 'first@gmail.com',
      };

      let exception: any;

      try {
        await subscriptionService.subscribe(existingSubscriber);
      } catch (e: any) {
        exception = e;
      }

      expect(exception).toBeInstanceOf(AlreadySubscribedException);
    });
  });

  describe('getAllSubscribers', () => {
    it('should get all subscribers from database', async () => {
      const foundSubscribers = await subscriptionService.getAllSubscribers();

      expect(foundSubscribers).toEqual(subscribers);
    });
  });
});

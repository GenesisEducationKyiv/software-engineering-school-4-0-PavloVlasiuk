import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { getLoggerToken } from 'nestjs-pino';

import {
  SubscribeEmailRequestDto,
  UnsubscribeEmailRequestDto,
} from './dto/requests';
import {
  AlreadySubscribedException,
  EntityNotFoundException,
} from './exceptions';
import {
  ISubscriptionService,
  SUBSCRIPTION_REPOSITORY,
  SUBSCRIPTION_SERVICE,
} from './interfaces';
import { SubscriptionRepository } from './repositories';
import { SubscriptionService } from './subscription.service';
import { DatabaseModule, PrismaService } from '../database';

describe('SubscriptionService', () => {
  const inactiveSubscriber = {
    email: 'ubsubscribed@gmail.com',
    isActive: false,
  };

  const subscribers: Prisma.SubscriptionCreateInput[] = [
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
        {
          provide: getLoggerToken(SubscriptionService.name),
          useValue: { info: jest.fn() },
        },
      ],
    }).compile();

    subscriptionService =
      testingModule.get<ISubscriptionService>(SUBSCRIPTION_SERVICE);
    prisma = testingModule.get<PrismaService>(PrismaService);

    await prisma.subscription.createMany({
      data: subscribers,
    });

    await prisma.subscription.create({ data: inactiveSubscriber });
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

      await prisma.subscription.delete({ where: { email: subscriber.email } });
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

    it('should update the subscription status of existing subscriber', async () => {
      const inactive: SubscribeEmailRequestDto = {
        email: inactiveSubscriber.email,
      };

      await subscriptionService.subscribe(inactive);

      const subscriber = await prisma.subscription.findFirst({
        where: { email: inactive.email },
      });

      expect(subscriber.email).toEqual(inactive.email);

      await prisma.subscription.update({
        where: { email: inactive.email },
        data: { isActive: false },
      });
    });
  });

  describe('getAllSubscribers', () => {
    it('should get all subscribers from database', async () => {
      const foundSubscribers = await subscriptionService.getAllSubscribers();

      expect(foundSubscribers.map(({ email }) => ({ email }))).toEqual(
        subscribers,
      );
    });
  });

  describe('unsubscribe', () => {
    it('should delete email subscription', async () => {
      const unsubscribeEmailDto: UnsubscribeEmailRequestDto = {
        email: 'second@gmail.com',
      };

      await subscriptionService.unsubscribe(unsubscribeEmailDto);

      const unsubscribedEmail = await prisma.subscription.findFirst({
        where: { email: unsubscribeEmailDto.email },
      });

      expect(unsubscribedEmail.isActive).toBe(false);

      await prisma.subscription.update({
        where: { email: unsubscribedEmail.email },
        data: { isActive: true },
      });
    });

    it('should throw EntityNotFoundException cause non-existent subscriber', async () => {
      const unsubscribeEmailDto: UnsubscribeEmailRequestDto = {
        email: 'some.email@gmail.com',
      };

      let exception: any;

      try {
        await subscriptionService.unsubscribe(unsubscribeEmailDto);
      } catch (e: any) {
        exception = e;
      }

      expect(exception).toBeInstanceOf(EntityNotFoundException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';

import {
  SubscribeEmailRequestDto,
  UnsubscribeEmailRequestDto,
} from './dto/requests';
import { Subscription } from './entities';
import {
  AlreadySubscribedException,
  EntityNotFoundException,
} from './exceptions';
import {
  ISubscriptionRepository,
  ISubscriptionService,
  SUBSCRIPTION_REPOSITORY,
  SUBSCRIPTION_SERVICE,
} from './interfaces';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionService', () => {
  let subscriptionService: ISubscriptionService;
  let subscriptionRepository: ISubscriptionRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: SUBSCRIPTION_SERVICE, useClass: SubscriptionService },
        {
          provide: SUBSCRIPTION_REPOSITORY,
          useValue: <ISubscriptionRepository>{
            createOrUpdate: jest.fn(),
            findByEmail: jest.fn(),
            findAll: jest.fn(),
            deleteByEmail: jest.fn(),
          },
        },
        {
          provide: getLoggerToken(SubscriptionService.name),
          useValue: { info: jest.fn() },
        },
      ],
    }).compile();

    subscriptionService =
      testingModule.get<ISubscriptionService>(SUBSCRIPTION_SERVICE);
    subscriptionRepository = testingModule.get<ISubscriptionRepository>(
      SUBSCRIPTION_REPOSITORY,
    );
  });

  it('should be defined', () => {
    expect(subscriptionService).toBeDefined();
  });

  describe('subscribe', () => {
    it('should create new subscriber', async () => {
      const subscribeEmailDto: SubscribeEmailRequestDto = {
        email: 'test.testovych@gmail.com',
      };

      jest.spyOn(subscriptionRepository, 'findByEmail').mockResolvedValue(null);

      await subscriptionService.subscribe(subscribeEmailDto);

      expect(subscriptionRepository.findByEmail).toHaveBeenCalledWith(
        subscribeEmailDto.email,
      );
      expect(subscriptionRepository.findByEmail).toHaveBeenCalledTimes(1);

      expect(subscriptionRepository.createOrUpdate).toHaveBeenCalledWith(
        subscribeEmailDto.email,
      );
      expect(subscriptionRepository.createOrUpdate).toHaveBeenCalledTimes(1);
    });

    it('should throw AlreadySubscribedException', async () => {
      const subscribeEmailDto: SubscribeEmailRequestDto = {
        email: 'test.testovych@gmail.com',
      };

      jest.spyOn(subscriptionRepository, 'findByEmail').mockResolvedValue({
        id: 'uuid',
        email: subscribeEmailDto.email,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      let exception: any;

      try {
        await subscriptionService.subscribe(subscribeEmailDto);
      } catch (ex: any) {
        exception = ex;
      }

      expect(exception).toBeInstanceOf(AlreadySubscribedException);

      expect(subscriptionRepository.findByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllSubscribers', () => {
    it('should return all subscribers', async () => {
      const subscribers: Subscription[] = [
        {
          id: '60f96e72-66e2-476d-ac4b-d46114d17e3a',
          email: 'adripp0@gmail.com',
          isActive: true,
          createdAt: new Date(2024, 2, 10),
          updatedAt: new Date(2024, 2, 10),
        },
        {
          id: '2fa7775d-a10e-4b97-9cfc-14cdc07a178c',
          email: 'abarizeret1@gmail.com',
          isActive: true,
          createdAt: new Date(2024, 2, 22),
          updatedAt: new Date(2024, 2, 22),
        },
        {
          id: '29e6aa23-6f9b-42f2-b3ec-6bbaaf8cdce6',
          email: 'bgemlett2@gmail.com',
          isActive: true,
          createdAt: new Date(2024, 4, 18),
          updatedAt: new Date(2024, 4, 18),
        },
      ];

      jest
        .spyOn(subscriptionRepository, 'findAll')
        .mockResolvedValue(subscribers);

      const foundSubscribers = await subscriptionService.getAllSubscribers();

      expect(foundSubscribers).toEqual(subscribers);

      expect(subscriptionRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('unsubscribe', () => {
    it('should delete email subscription', async () => {
      const unsubscribeEmailDto: UnsubscribeEmailRequestDto = {
        email: 'subscribed.email@gmail.com',
      };

      jest.spyOn(subscriptionRepository, 'findByEmail').mockResolvedValue({
        id: 'uuid',
        email: unsubscribeEmailDto.email,
        isActive: true,
        createdAt: new Date(2024, 7, 1),
        updatedAt: new Date(2024, 4, 19),
      });

      await subscriptionService.unsubscribe(unsubscribeEmailDto);

      expect(subscriptionRepository.findByEmail).toHaveBeenCalledWith(
        unsubscribeEmailDto.email,
      );
      expect(subscriptionRepository.findByEmail).toHaveBeenCalledTimes(1);

      expect(subscriptionRepository.deleteByEmail).toHaveBeenCalledWith(
        unsubscribeEmailDto.email,
      );
      expect(subscriptionRepository.deleteByEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw EntityNotFoundException', async () => {
      const unsubscribeEmailDto: UnsubscribeEmailRequestDto = {
        email: 'subscribed.email@gmail.com',
      };

      jest.spyOn(subscriptionRepository, 'findByEmail').mockResolvedValue(null);

      let exception: any;

      try {
        await subscriptionService.unsubscribe(unsubscribeEmailDto);
      } catch (ex: any) {
        exception = ex;
      }

      expect(exception).toBeInstanceOf(EntityNotFoundException);

      expect(subscriptionRepository.findByEmail).toHaveBeenCalledTimes(1);
    });
  });
});

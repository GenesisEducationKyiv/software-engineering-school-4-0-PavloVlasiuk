import { EmailRepository } from '../database/repositories/email.repository';
import { EmailService } from './email.service';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { ISendEmailOptions } from './interfaces/send-email-options.interface';
import { EMAIL_SUBJECT } from '../task-schedule/task-schedule.constants';
import { SubscribeEmailDto } from './dtos/subscribe-email.dto';
import { AlreadySubscribedException } from '../common/exceptions';
import { Email } from '@prisma/client';

describe('EmailService', () => {
  let emailService: EmailService;
  let mailerService: MailerService;
  let emailRepository: EmailRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: EmailRepository,
          useValue: {
            find: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    emailService = testingModule.get<EmailService>(EmailService);
    mailerService = testingModule.get<MailerService>(MailerService);
    emailRepository = testingModule.get<EmailRepository>(EmailRepository);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  describe('sendTemplatedEmail', () => {
    it('should log an error', async () => {
      const emailOptions: ISendEmailOptions = {
        to: 'tester@gmail.com',
        subject: EMAIL_SUBJECT,
        context: {
          rate: 35.55,
          date: new Date().toDateString(),
        },
      };

      const spy = jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValue('mailer error');

      console.error = jest.fn();

      await emailService.sendTemplatedEmail(emailOptions);

      expect(console.error).toHaveBeenCalledWith(
        'Sending email error: mailer error',
      );

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribe', () => {
    it('should create new subscribed email', async () => {
      const create: SubscribeEmailDto = {
        email: 'test.testovych@gmail.com',
      };

      const spyFind = jest
        .spyOn(emailRepository, 'find')
        .mockResolvedValue(null);

      await emailService.subscribe(create);

      expect(spyFind).toHaveBeenCalledWith(create);
      expect(spyFind).toHaveBeenCalledTimes(1);

      expect(emailRepository.create).toHaveBeenCalledWith(create);
      expect(emailRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw AlreadySubscribedException', async () => {
      const create: SubscribeEmailDto = {
        email: 'test.testovych@gmail.com',
      };

      const spy = jest.spyOn(emailRepository, 'find').mockResolvedValue({
        id: 'uuid',
        email: create.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      let exception: any;

      try {
        await emailService.subscribe(create);
      } catch (ex: any) {
        exception = ex;
      }

      expect(exception).toBeInstanceOf(AlreadySubscribedException);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllSubscribers', () => {
    it('should return all subscribed emails', async () => {
      const emails: Array<Email> = [
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

      const spy = jest
        .spyOn(emailRepository, 'findMany')
        .mockResolvedValue(emails);

      const subscribers = await emailService.getAllSubscribers();

      expect(spy).toHaveBeenCalledTimes(1);

      expect(subscribers).toEqual(emails);
    });
  });
});

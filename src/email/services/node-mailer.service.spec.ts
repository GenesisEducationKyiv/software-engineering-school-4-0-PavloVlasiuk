import { resolve } from 'path';

import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

import { NodeMailerService } from './node-mailer.service';
import { DEFAULT_EMAIL_SUBJECT } from '../email.constants';
import { ISendEmailOptions } from '../interfaces/send-email-options.interface';

describe('NodeMailerService', () => {
  let nodeMailerService: NodeMailerService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        NodeMailerService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    nodeMailerService = testingModule.get<NodeMailerService>(NodeMailerService);
    mailerService = testingModule.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(nodeMailerService).toBeDefined();
  });

  describe('sendTemplatedEmail', () => {
    it('should use default email subject', async () => {
      const emailOptions: ISendEmailOptions = {
        to: 'tester@gmail.com',
        context: {
          rate: 35.55,
          date: new Date().toDateString(),
        },
      };

      jest.spyOn(mailerService, 'sendMail').mockResolvedValue(undefined);

      await nodeMailerService.sendTemplatedEmail(emailOptions);

      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        ...emailOptions,
        template: resolve('./src/email/templates/exchange-rate.template.hbs'),
        subject: DEFAULT_EMAIL_SUBJECT,
      });
    });

    it('should log an error', async () => {
      const emailOptions: ISendEmailOptions = {
        to: 'tester@gmail.com',
        context: {
          rate: 35.55,
          date: new Date().toDateString(),
        },
      };

      jest.spyOn(mailerService, 'sendMail').mockRejectedValue('mailer error');

      console.error = jest.fn();

      await nodeMailerService.sendTemplatedEmail(emailOptions);

      expect(console.error).toHaveBeenCalledWith(
        'Sending email error: mailer error',
      );

      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    });
  });
});

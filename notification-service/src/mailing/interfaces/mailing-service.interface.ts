import { ISendEmailOptions } from './send-email-options.interface';

export const MAILING_SERVICE = 'MailingService';

export interface IMailingService {
  sendTemplatedEmail(options: ISendEmailOptions): Promise<void>;
}

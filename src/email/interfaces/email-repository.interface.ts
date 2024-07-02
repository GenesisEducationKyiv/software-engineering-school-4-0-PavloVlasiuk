import { Email } from '../entities/email.entity';

export const EMAIL_REPOSITORY = 'EmailRepository';

export interface IEmailRepository {
  create(email: string): Promise<Email>;
  findByEmail(email: string): Promise<Email | null>;
  findAll(): Promise<Email[]>;
}

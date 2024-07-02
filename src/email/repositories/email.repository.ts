import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { Email } from '../entities/email.entity';
import { IEmailRepository } from '../interfaces';

@Injectable()
export class EmailRepository implements IEmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string): Promise<Email> {
    const createdEmail = await this.prisma.email.create({ data: { email } });

    return new Email(createdEmail);
  }

  async findByEmail(email: string): Promise<Email> {
    const foundEmail = await this.prisma.email.findFirst({ where: { email } });

    return foundEmail ? new Email(foundEmail) : null;
  }

  async findAll(): Promise<Email[]> {
    const foundEmails = await this.prisma.email.findMany();

    return foundEmails.map((email) => new Email(email));
  }
}

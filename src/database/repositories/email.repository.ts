import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Email, Prisma } from '@prisma/client';

@Injectable()
export class EmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EmailCreateInput): Promise<Email> {
    return this.prisma.email.create({ data });
  }

  async find(where: Prisma.EmailWhereInput): Promise<Email> {
    return this.prisma.email.findFirst({ where });
  }

  async findMany(args?: Prisma.EmailFindManyArgs): Promise<Array<Email>> {
    return this.prisma.email.findMany({ ...args });
  }
}

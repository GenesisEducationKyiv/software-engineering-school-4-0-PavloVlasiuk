import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { Subscription } from '../entities';
import { ISubscriptionRepository } from '../interfaces';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.create({
      data: { email },
    });

    return subscription as Subscription;
  }

  async findByEmail(email: string): Promise<Subscription | null> {
    const foundEmail = await this.prisma.subscription.findFirst({
      where: { email },
    });

    return foundEmail as Subscription;
  }

  async findAll(): Promise<Subscription[]> {
    const foundEmails = await this.prisma.subscription.findMany();

    return foundEmails as Subscription[];
  }
}

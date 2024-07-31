import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { Subscription } from '../entities';
import { ISubscriptionRepository } from '../interfaces';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdate(email: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });

    return subscription as Subscription;
  }

  async findByEmail(email: string): Promise<Subscription | null> {
    const foundEmail = await this.prisma.subscription.findFirst({
      where: { email, isActive: true },
    });

    return foundEmail as Subscription;
  }

  async findAll(): Promise<Subscription[]> {
    const foundEmails = await this.prisma.subscription.findMany({
      where: { isActive: true },
    });

    return foundEmails as Subscription[];
  }

  async deleteByEmail(email: string): Promise<Subscription> {
    const deletedSubscription = await this.prisma.subscription.update({
      where: { email },
      data: {
        isActive: false,
      },
    });

    return deletedSubscription as Subscription;
  }
}

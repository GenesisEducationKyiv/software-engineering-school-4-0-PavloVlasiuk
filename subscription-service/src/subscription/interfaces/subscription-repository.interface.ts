import { Subscription } from '../entities';

export const SUBSCRIPTION_REPOSITORY = 'SubscriptionRepository';

export interface ISubscriptionRepository {
  createOrUpdate(email: string): Promise<Subscription>;
  findByEmail(email: string): Promise<Subscription | null>;
  findAll(): Promise<Subscription[]>;
  deleteByEmail(email: string): Promise<Subscription>;
}

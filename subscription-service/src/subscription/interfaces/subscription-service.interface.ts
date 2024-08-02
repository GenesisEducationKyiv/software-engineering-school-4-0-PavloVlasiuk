import { SubscribeEmailRequestDto } from '../dto/requests';
import { Subscription } from '../entities';

export const SUBSCRIPTION_SERVICE = 'SubscriptionService';

export interface ISubscriptionService {
  subscribe(subscribeEmailDto: SubscribeEmailRequestDto): Promise<void>;
  getAllSubscribers(): Promise<Subscription[]>;
}

import { SubscribeEmailDto, UnsubscribeEmailDto } from '../dto';
import { Subscription } from '../schemas';

export const SUBSCRIPTION_SERVICE = 'SubscriptionService';

export interface ISubscriptionService {
  subscribe(subscribeEmailDto: SubscribeEmailDto): Promise<void>;
  unsubscribe(unsubscribeEmailDto: UnsubscribeEmailDto): Promise<void>;
  getAllSubscribers(): Promise<Subscription[]>;
}

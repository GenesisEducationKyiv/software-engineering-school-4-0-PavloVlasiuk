import { Subscription } from '../../../subscription/entities';

class SubscriberResponse {
  id: string;
  email: string;

  constructor(subscriber: Subscription) {
    Object.assign(this, subscriber);
  }
}

export class SubscribersResponse {
  subscribers: SubscriberResponse[];

  constructor(subscribers: Subscription[]) {
    const mapped = subscribers.map((sub) => new SubscriberResponse(sub));

    this.subscribers = mapped;
  }
}

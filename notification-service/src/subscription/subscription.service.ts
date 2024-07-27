import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SubscribeEmailDto, UnsubscribeEmailDto } from './dto';
import {
  AlreadySubscribedException,
  EntityNotFoundException,
} from './exceptions';
import { ISubscriptionService } from './interfaces';
import { Subscription, SubscriptionDocument } from './schemas';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async subscribe(subscribeEmailDto: SubscribeEmailDto): Promise<void> {
    const { email } = subscribeEmailDto;

    const isSubscribed = await this.isSubscribed(email);

    if (isSubscribed) {
      throw new AlreadySubscribedException();
    }

    const newSubscription = new this.subscriptionModel(subscribeEmailDto);

    await newSubscription.save();
  }

  async unsubscribe(unsubscribeEmailDto: UnsubscribeEmailDto): Promise<void> {
    const { email } = unsubscribeEmailDto;

    const isSubscribed = await this.isSubscribed(email);

    if (!isSubscribed) {
      throw new EntityNotFoundException(Subscription.name);
    }

    await this.subscriptionModel.findOneAndDelete({ email }).exec();
  }

  async getAllSubscribers(): Promise<Subscription[]> {
    console.log(await this.subscriptionModel.find().exec());
    return this.subscriptionModel.find().exec();
  }

  private async isSubscribed(email: string): Promise<boolean> {
    const subscription = await this.subscriptionModel.findOne({ email }).exec();

    return !!subscription;
  }
}

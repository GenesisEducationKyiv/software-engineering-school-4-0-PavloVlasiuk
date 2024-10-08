import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

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
    @InjectPinoLogger(SubscriptionService.name)
    private readonly logger: PinoLogger,
  ) {}

  async subscribe(subscribeEmailDto: SubscribeEmailDto): Promise<void> {
    const { email } = subscribeEmailDto;

    this.logger.info(
      `Local(notification microservice) - Subscribing email: ${email}`,
    );

    const isSubscribed = await this.isSubscribed(email);

    if (isSubscribed) {
      throw new AlreadySubscribedException();
    }

    const newSubscription = new this.subscriptionModel(subscribeEmailDto);

    await newSubscription.save();
  }

  async unsubscribe(unsubscribeEmailDto: UnsubscribeEmailDto): Promise<void> {
    const { email } = unsubscribeEmailDto;

    this.logger.info(
      `Local(notification microservice) - Unsubscribing email: ${email}`,
    );

    const isSubscribed = await this.isSubscribed(email);

    if (!isSubscribed) {
      throw new EntityNotFoundException(Subscription.name);
    }

    await this.subscriptionModel.findOneAndDelete(unsubscribeEmailDto).exec();
  }

  async getAllSubscribers(): Promise<Subscription[]> {
    return this.subscriptionModel.find().exec();
  }

  private async isSubscribed(email: string): Promise<boolean> {
    const subscription = await this.subscriptionModel.findOne({ email }).exec();

    return !!subscription;
  }
}

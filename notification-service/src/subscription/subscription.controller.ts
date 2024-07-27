import { Controller, HttpStatus, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { SubscribeEmailDto, UnsubscribeEmailDto } from './dto';
import { ISubscriptionService, SUBSCRIPTION_SERVICE } from './interfaces';
import { SuccessfulResponse } from '../common/responses';
import { IResponse } from '../common/responses/interfaces';

@Controller()
export class SubscriptionController {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  @MessagePattern('subscription-create')
  async subscribe(
    @Payload() dto: SubscribeEmailDto,
    @Ctx() context: RmqContext,
  ): Promise<IResponse> {
    console.log('Subscription create message');

    const channel = context.getChannelRef();

    const originalMessage = context.getMessage();

    try {
      await this.subscriptionService.subscribe(dto);

      channel.ack(originalMessage);

      return new SuccessfulResponse('Subscription created', HttpStatus.CREATED);
    } catch (error) {
      console.log(error);

      channel.ack(originalMessage);

      throw error;
    }
  }

  @MessagePattern('subscription-delete')
  async unsubscribe(
    @Payload() dto: UnsubscribeEmailDto,
    @Ctx() context: RmqContext,
  ): Promise<IResponse> {
    console.log('Subscription delete message');

    const channel = context.getChannelRef();

    const originalMessage = context.getMessage();

    try {
      await this.subscriptionService.unsubscribe(dto);

      channel.ack(originalMessage);

      return new SuccessfulResponse(
        'Subscription deleted',
        HttpStatus.NO_CONTENT,
      );
    } catch (error) {
      console.log(error);

      channel.ack(originalMessage);

      throw error;
    }
  }
}

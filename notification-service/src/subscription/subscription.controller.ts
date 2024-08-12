import { Controller, HttpStatus, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { SubscribeEmailDto, UnsubscribeEmailDto } from './dto';
import { ISubscriptionService, SUBSCRIPTION_SERVICE } from './interfaces';
import { MESSAGE_PATTERNS } from './subscription.constants';
import { SuccessfulResponse } from '../common/responses';
import { IResponse } from '../common/responses/interfaces';

@Controller()
export class SubscriptionController {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
    @InjectPinoLogger(SubscriptionController.name)
    private readonly logger: PinoLogger,
  ) {}

  @MessagePattern(MESSAGE_PATTERNS.SUBSCRIPTION_CREATE)
  async subscribe(
    @Payload() dto: SubscribeEmailDto,
    @Ctx() context: RmqContext,
  ): Promise<IResponse> {
    this.logger.info(
      `Processing message - ${MESSAGE_PATTERNS.SUBSCRIPTION_CREATE}`,
    );

    const channel = context.getChannelRef();

    const originalMessage = context.getMessage();

    try {
      await this.subscriptionService.subscribe(dto);

      channel.ack(originalMessage);

      return new SuccessfulResponse('Subscription created', HttpStatus.CREATED);
    } catch (error) {
      channel.ack(originalMessage);

      throw error;
    }
  }

  @MessagePattern(MESSAGE_PATTERNS.SUBSCRIPTION_DELETE)
  async unsubscribe(
    @Payload() dto: UnsubscribeEmailDto,
    @Ctx() context: RmqContext,
  ): Promise<IResponse> {
    this.logger.info(
      `Processing message - ${MESSAGE_PATTERNS.SUBSCRIPTION_DELETE}`,
    );

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
      channel.ack(originalMessage);

      throw error;
    }
  }
}

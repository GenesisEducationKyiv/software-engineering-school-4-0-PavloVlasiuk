import { Controller, HttpStatus, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { UpdateRateDto } from './dto';
import { IRateService, RATE_SERVICE } from './interfaces';
import { SuccessfulResponse } from '../common/responses';
import { IResponse } from '../common/responses/interfaces';

@Controller()
export class RateConroller {
  constructor(
    @Inject(RATE_SERVICE)
    private readonly rateService: IRateService,
  ) {}

  @MessagePattern('rate-synchronize')
  async createCurrent(
    @Payload() dto: UpdateRateDto,
    @Ctx() context: RmqContext,
  ): Promise<IResponse> {
    console.log('Rate synchronize message');

    const channel = context.getChannelRef();

    const originalMessage = context.getMessage();

    try {
      await this.rateService.createCurrent(dto);

      channel.ack(originalMessage);

      return new SuccessfulResponse(
        'Rate synchronized successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      channel.ack(originalMessage);

      throw error;
    }
  }
}

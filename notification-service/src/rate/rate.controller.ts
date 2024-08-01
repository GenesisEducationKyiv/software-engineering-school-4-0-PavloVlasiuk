import { Controller, HttpStatus, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { UpdateRateDto } from './dto';
import { IRateService, RATE_SERVICE } from './interfaces';
import { MESSAGE_PATTERNS } from './rate.constants';
import { SuccessfulResponse } from '../common/responses';
import { IResponse } from '../common/responses/interfaces';

@Controller()
export class RateConroller {
  constructor(
    @Inject(RATE_SERVICE)
    private readonly rateService: IRateService,
    @InjectPinoLogger(RateConroller.name)
    private readonly logger: PinoLogger,
  ) {}

  @MessagePattern(MESSAGE_PATTERNS.RATE_SYNCHRONIZE)
  async createCurrent(
    @Payload() dto: UpdateRateDto,
    @Ctx() context: RmqContext,
  ): Promise<IResponse> {
    this.logger.info(
      `Processing message - ${MESSAGE_PATTERNS.RATE_SYNCHRONIZE}`,
    );

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

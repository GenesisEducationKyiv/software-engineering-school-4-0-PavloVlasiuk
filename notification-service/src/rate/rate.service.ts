import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { UpdateRateDto } from './dto';
import { IRateService } from './interfaces';
import { Rate, RateDocument } from './schemas/rate.schema';

@Injectable()
export class RateService implements IRateService {
  constructor(
    @InjectModel(Rate.name)
    private readonly rateModel: Model<RateDocument>,
    @InjectPinoLogger(RateService.name)
    private readonly logger: PinoLogger,
  ) {}

  async createCurrent({ rate, exchangeDate }: UpdateRateDto): Promise<void> {
    const newRate = new this.rateModel({ value: rate, exchangeDate });

    this.logger.info(
      `Local(notification microservice) - Updating current rate: ${newRate}`,
    );

    await newRate.save();
  }

  async getLatest(): Promise<Rate> {
    return this.rateModel.findOne().sort({ createdAt: -1 }).exec();
  }
}

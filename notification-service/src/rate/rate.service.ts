import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdateRateDto } from './dto';
import { IRateService } from './interfaces';
import { Rate, RateDocument } from './schemas/rate.schema';

@Injectable()
export class RateService implements IRateService {
  constructor(
    @InjectModel(Rate.name)
    private readonly rateModel: Model<RateDocument>,
  ) {}

  async createCurrent({ rate, exchangeDate }: UpdateRateDto): Promise<void> {
    const newRate = new this.rateModel({ value: rate, exchangeDate });

    await newRate.save();
  }

  async getLatest(): Promise<Rate> {
    return this.rateModel.findOne().sort({ createdAt: -1 }).exec();
  }
}

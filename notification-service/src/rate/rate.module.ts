import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RateConroller } from './rate.controller';
import { rateProviders } from './rate.providers';
import { Rate, RateSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Rate.name,
        schema: RateSchema,
      },
    ]),
  ],
  controllers: [RateConroller],
  providers: [...rateProviders],
})
export class RateModule {}

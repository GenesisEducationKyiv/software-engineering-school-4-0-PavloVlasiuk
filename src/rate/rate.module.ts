import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { RateController } from './rate.controller';
import { RateService } from './rate.service';

@Module({
  imports: [HttpModule],
  controllers: [RateController],
  providers: [RateService],
  exports: [RateService],
})
export class RateModule {}

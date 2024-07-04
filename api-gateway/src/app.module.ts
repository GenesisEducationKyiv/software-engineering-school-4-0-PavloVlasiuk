import { Module } from '@nestjs/common';
import { RateModule } from './modules/rate/rate.module';

@Module({
  imports: [RateModule],
})
export class AppModule {}

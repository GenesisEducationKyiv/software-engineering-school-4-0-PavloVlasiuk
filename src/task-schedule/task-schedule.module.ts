import { Module } from '@nestjs/common';

import { TaskScheduleService } from './task-schedule.service';
import { EmailModule } from '../email/email.module';
import { RateModule } from '../rate/rate.module';

@Module({
  imports: [RateModule, EmailModule],
  providers: [TaskScheduleService],
})
export class TaskScheduleModule {}

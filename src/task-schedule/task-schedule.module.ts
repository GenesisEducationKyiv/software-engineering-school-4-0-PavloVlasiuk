import { Module } from '@nestjs/common';
import { TaskScheduleService } from './task-schedule.service';
import { RateModule } from 'src/rate/rate.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [RateModule, EmailModule],
  providers: [TaskScheduleService],
})
export class TaskScheduleModule {}

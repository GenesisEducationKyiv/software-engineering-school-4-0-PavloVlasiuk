import { Module, Provider } from '@nestjs/common';

import { TASK_SCHEDULE_SERVICE } from './interfaces';
import { TaskScheduleService } from './task-schedule.service';
import { EmailModule } from '../email/email.module';
import { RateModule } from '../rate/rate.module';

const TaskScheduleServiceImpl: Provider = {
  provide: TASK_SCHEDULE_SERVICE,
  useClass: TaskScheduleService,
};

@Module({
  imports: [RateModule, EmailModule],
  providers: [TaskScheduleServiceImpl],
})
export class TaskScheduleModule {}

import { Body, Controller, Post } from '@nestjs/common';

import { SubscribeEmailDto } from './dtos/subscribe-email.dto';
import { EmailService } from './services/email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('subscribe')
  async subscribe(@Body() subscribeEmailDto: SubscribeEmailDto): Promise<void> {
    return await this.emailService.subscribe(subscribeEmailDto);
  }
}

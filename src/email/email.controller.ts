import { Body, Controller, Inject, Post } from '@nestjs/common';

import { SubscribeEmailDto } from './dtos/subscribe-email.dto';
import { EMAIL_SERVICE, IEmailService } from './interfaces';

@Controller('email')
export class EmailController {
  constructor(
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  @Post('subscribe')
  async subscribe(@Body() subscribeEmailDto: SubscribeEmailDto): Promise<void> {
    return await this.emailService.subscribe(subscribeEmailDto);
  }
}

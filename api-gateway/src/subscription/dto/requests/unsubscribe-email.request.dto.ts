import { UnsubscribeEmailDto } from '@usd-to-uah-rate-api/proto/dist/subscription';
import { IsEmail } from 'class-validator';

export class UnsubscribeEmailRequestDto implements UnsubscribeEmailDto {
  @IsEmail()
  email: string;
}

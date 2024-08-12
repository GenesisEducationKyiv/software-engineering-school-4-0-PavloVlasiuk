import { SubscribeEmailDto } from '@usd-to-uah-rate-api/proto/dist/subscription';
import { IsEmail } from 'class-validator';

export class SubscribeEmailRequestDto implements SubscribeEmailDto {
  @IsEmail()
  email: string;
}

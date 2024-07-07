import { SubscribeEmailDto } from '../../../../../proto/dist/types/subscription';
import { IsEmail } from 'class-validator';

export class SubscribeEmailRequestDto implements SubscribeEmailDto {
  @IsEmail()
  email: string;
}

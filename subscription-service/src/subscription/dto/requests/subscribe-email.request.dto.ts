import { IsEmail } from 'class-validator';

export class SubscribeEmailRequestDto {
  @IsEmail()
  email: string;
}

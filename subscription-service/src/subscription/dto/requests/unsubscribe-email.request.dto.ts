import { IsEmail } from 'class-validator';

export class UnsubscribeEmailRequestDto {
  @IsEmail()
  email: string;
}

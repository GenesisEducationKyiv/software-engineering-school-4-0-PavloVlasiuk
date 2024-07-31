import { IsEmail } from 'class-validator';

export class UnsubscribeEmailDto {
  @IsEmail()
  email: string;
}

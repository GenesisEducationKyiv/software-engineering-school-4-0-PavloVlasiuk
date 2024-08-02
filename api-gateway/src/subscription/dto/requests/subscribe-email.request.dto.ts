import { IsEmail } from 'class-validator';

import { SubscribeEmailDto } from '../../../../../proto/dist/types/subscription';

export class SubscribeEmailRequestDto implements SubscribeEmailDto {
  @IsEmail()
  email: string;
}

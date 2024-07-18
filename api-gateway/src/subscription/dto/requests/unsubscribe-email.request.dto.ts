import { IsEmail } from 'class-validator';

import { UnsubscribeEmailDto } from '../../../../../proto/dist/types/subscription';

export class UnsubscribeEmailRequestDto implements UnsubscribeEmailDto {
  @IsEmail()
  email: string;
}

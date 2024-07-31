import { IsNumber, IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateRateDto {
  @IsNumber()
  @IsNotEmpty()
  rate: number;

  @IsDateString()
  @IsNotEmpty()
  exchangeDate: string;
}

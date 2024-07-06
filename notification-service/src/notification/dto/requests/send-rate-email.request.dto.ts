import { IExchangeRate, IRecipient } from 'src/notification/interfaces';

export class SendRateEmailRequestDto {
  rate: IExchangeRate;
  recipients: IRecipient[];
}

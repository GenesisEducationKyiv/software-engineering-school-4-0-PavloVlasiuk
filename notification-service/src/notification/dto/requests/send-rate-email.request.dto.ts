import { IExchangeRate, IRecipient } from '../../../notification/interfaces';
export class SendRateEmailRequestDto {
  rate: IExchangeRate;
  recipients: IRecipient[];
}

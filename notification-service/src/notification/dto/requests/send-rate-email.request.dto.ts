import { ISendRateData } from '../../../notification/interfaces';
export class SendRateEmailRequestDto {
  eventId: string;
  eventType: string;
  aggregateId: string;
  timestamp: Date;
  data: ISendRateData;
}

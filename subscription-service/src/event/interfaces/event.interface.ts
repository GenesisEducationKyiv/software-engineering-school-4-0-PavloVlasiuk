export interface IEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  timestamp: Date;
  data: any;
}

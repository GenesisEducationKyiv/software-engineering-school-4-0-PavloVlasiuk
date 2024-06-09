interface ISendCurrentRateContext {
  rate: number;
  date: string;
}
export interface ISendEmailOptions {
  to: string;
  subject: string;
  context: ISendCurrentRateContext;
}

export interface ISendCurrentRateContext {
  rate: number;
  date: string;
}
export interface ISendEmailOptions {
  to: string;
  context: ISendCurrentRateContext;
  subject?: string;
}

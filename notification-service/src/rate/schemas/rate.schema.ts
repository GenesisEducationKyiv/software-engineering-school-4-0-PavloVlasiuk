import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RateDocument = HydratedDocument<Rate>;

@Schema({ timestamps: true })
export class Rate {
  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  exchangeDate: string;
}

export const RateSchema = SchemaFactory.createForClass(Rate);

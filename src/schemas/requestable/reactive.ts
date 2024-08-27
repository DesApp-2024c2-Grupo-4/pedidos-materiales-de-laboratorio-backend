import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReactiveDocument = HydratedDocument<Reactive>;

@Schema()
export class Reactive {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  cas: string;

  @Prop()
  stock: number;

  @Prop()
  inUse: number;

  @Prop({ required: true, default: true })
  isAvailable: boolean;
}

export const ReactiveSchema = SchemaFactory.createForClass(Reactive);

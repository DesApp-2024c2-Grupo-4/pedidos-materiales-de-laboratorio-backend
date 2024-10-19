import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDelete } from '../common/soft-delete.schema';

export type ReactiveDocument = HydratedDocument<Reactive>;

@Schema()
export class Reactive extends SoftDelete {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  cas: string;

  @Prop()
  stock: number;

  @Prop({ required: true, default: true })
  isAvailable: boolean;
}

export const ReactiveSchema = SchemaFactory.createForClass(Reactive);

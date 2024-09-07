import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { InUse } from '../common/in-use.schema';
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

  @Prop({ type: [InUse] })
  inUse: InUse[];

  @Prop({ required: true, default: true })
  isAvailable: boolean;
}

export const ReactiveSchema = SchemaFactory.createForClass(Reactive);

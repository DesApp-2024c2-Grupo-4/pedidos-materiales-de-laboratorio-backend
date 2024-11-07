import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDelete } from '../common/soft-delete.schema';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export type ReactiveDocument = HydratedDocument<Reactive>;

@Schema()
export class Reactive extends SoftDelete {
  @IsString()
  @Prop({ required: true })
  description: string;

  @IsString()
  @Prop({ required: true })
  cas: string;

  @IsInt()
  @Prop()
  stock: number;

  @IsBoolean()
  @Prop({ required: true, default: true })
  isAvailable: boolean;
}

export const ReactiveSchema = SchemaFactory.createForClass(Reactive);

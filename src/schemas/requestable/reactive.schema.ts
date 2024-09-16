import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { InUse } from '../common/in-use.schema';
import { SoftDelete } from '../common/soft-delete.schema';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export type ReactiveDocument = HydratedDocument<Reactive>;

@Schema()
export class Reactive extends SoftDelete {
  @IsString()
  @Prop({ required: true })
  description: string;

  @IsString()
  @Prop({ required: true })
  cas: string;

  @IsNumber()
  @Prop()
  stock: number;

  @IsArray()
  @Prop({ type: [InUse] })
  inUse: InUse[];

  @IsBoolean()
  @Prop({ required: true, default: true })
  isAvailable: boolean;
}

export const ReactiveSchema = SchemaFactory.createForClass(Reactive);

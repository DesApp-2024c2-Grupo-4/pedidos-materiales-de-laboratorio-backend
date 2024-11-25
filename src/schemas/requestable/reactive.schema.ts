import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDelete } from '../common/soft-delete.schema';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { HasEnoughStockAvailable } from '../request.schema';
import { Type } from 'class-transformer';

export type ReactiveDocument = HydratedDocument<Reactive>;

@Schema({ timestamps: true })
export class Reactive extends SoftDelete implements HasEnoughStockAvailable {
  @IsString()
  @Prop({ required: true })
  description: string;

  @IsString()
  @Prop({ required: true })
  cas: string;

  @IsInt()
  @Prop()
  stock: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Prop()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Prop()
  updatedAt?: Date;

  hasEnoughStockAvailable: (requiredAmount: number) => boolean;
}

export const ReactiveSchema = SchemaFactory.createForClass(Reactive);

ReactiveSchema.methods.hasEnoughStockAvailable = function (
  requiredAmount: number,
): boolean {
  return this.stock >= requiredAmount;
};

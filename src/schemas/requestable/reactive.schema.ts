import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDelete } from '../common/soft-delete.schema';
import { IsBoolean, IsInt, IsString } from 'class-validator';
import { HasEnoughStockAvailable } from '../request.schema';

export type ReactiveDocument = HydratedDocument<Reactive>;

@Schema()
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

  @IsBoolean()
  @Prop({ required: true, default: true })
  isAvailable: boolean;

  hasEnoughStockAvailable: (requiredAmount: number) => boolean;
}

export const ReactiveSchema = SchemaFactory.createForClass(Reactive);

ReactiveSchema.methods.hasEnoughStockAvailable = function (
  requiredAmount: number,
): boolean {
  return this.stock >= requiredAmount;
};

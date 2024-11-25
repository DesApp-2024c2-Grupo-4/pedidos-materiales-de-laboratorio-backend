import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDelete } from '../common/soft-delete.schema';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { HasEnoughStockAvailable } from '../request.schema';

export type MaterialDocument = HydratedDocument<Material>;

@Schema({ timestamps: true })
export class Material extends SoftDelete implements HasEnoughStockAvailable {
  @IsString()
  @Prop({ required: true })
  description: string;

  @IsString()
  @Prop({ required: true })
  unitMeasure: string;

  @IsString()
  @Prop({ required: true })
  type: string;

  @IsNumber()
  @Prop({ required: true })
  stock: number;

  @IsOptional()
  @IsNumber()
  @Prop()
  inRepair: number;

  @IsBoolean()
  @Prop({ required: true, default: true })
  isAvailable: boolean;

  @IsOptional()
  @IsDate()
  @Prop()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Prop()
  updatedAt?: Date;

  hasEnoughStockAvailable: (requiredAmount: number) => boolean;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);

MaterialSchema.methods.hasEnoughStockAvailable = function (
  requiredAmount: number,
): boolean {
  return this.stock - this.inRepair >= requiredAmount;
};

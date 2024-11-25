import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDelete } from '../common/soft-delete.schema';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { HasEnoughStockAvailable } from '../request.schema';
import { Type } from 'class-transformer';
import { MaterialType, MaterialTypes } from '../../material/material.const';

export type MaterialDocument = HydratedDocument<Material>;

@Schema({ timestamps: true })
export class Material extends SoftDelete implements HasEnoughStockAvailable {
  @IsString()
  @Prop({ required: true })
  description: string;

  @IsString()
  @Prop({ required: true })
  unitMeasure: string;

  @IsEnum(Object.keys(MaterialTypes), { each: true })
  @Prop({ required: true })
  type: MaterialType;

  @IsNumber()
  @Prop({ required: true })
  stock: number;

  @IsOptional()
  @IsNumber()
  @Prop()
  inRepair: number;

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

export const MaterialSchema = SchemaFactory.createForClass(Material);

MaterialSchema.methods.hasEnoughStockAvailable = function (
  requiredAmount: number,
): boolean {
  return this.stock - this.inRepair >= requiredAmount;
};

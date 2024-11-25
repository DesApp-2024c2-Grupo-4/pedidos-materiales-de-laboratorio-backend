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

export type EquipmentDocument = HydratedDocument<Equipment>;

@Schema({ timestamps: true })
export class Equipment extends SoftDelete implements HasEnoughStockAvailable {
  @IsString()
  @Prop({ required: true })
  type: string;

  @IsString()
  @Prop({ required: true })
  description: string;

  @IsInt()
  @Prop({ required: true })
  stock: number;

  @IsString()
  @Prop({ required: true })
  unitMeasure: string;

  @IsInt()
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

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);

EquipmentSchema.methods.hasEnoughStockAvailable = function (
  requiredAmount: number,
): boolean {
  return this.stock - this.inRepair >= requiredAmount;
};

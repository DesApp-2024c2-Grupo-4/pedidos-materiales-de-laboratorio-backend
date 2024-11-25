import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDelete } from '../common/soft-delete.schema';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { HasEnoughStockAvailable } from '../request.schema';
import { Type } from 'class-transformer';
import { EquipmentTypes, EquipmentType } from '../../equipment/equipment.const';

export type EquipmentDocument = HydratedDocument<Equipment>;

@Schema({ timestamps: true })
export class Equipment extends SoftDelete implements HasEnoughStockAvailable {
  @IsEnum(Object.keys(EquipmentTypes), { each: true })
  @Prop({ required: true })
  type: EquipmentType;

  @IsString()
  @Prop({ required: true })
  description: string;

  @IsInt()
  @Prop({ required: true })
  stock: number;

  @IsInt()
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

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);

EquipmentSchema.methods.hasEnoughStockAvailable = function (
  requiredAmount: number,
): boolean {
  return this.stock - this.inRepair >= requiredAmount;
};

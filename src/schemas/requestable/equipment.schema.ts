import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDelete } from '../common/soft-delete.schema';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export type EquipmentDocument = HydratedDocument<Equipment>;

@Schema()
export class Equipment extends SoftDelete {
  @IsString()
  @Prop({ required: true })
  type: string;

  @IsString()
  @Prop({ required: true })
  description: string;

  @IsNumber()
  @Prop({ required: true })
  stock: number;

  @IsString()
  @Prop({ required: true })
  unitMeasure: string;

  @IsNumber()
  @Prop()
  inRepair: number;

  @IsBoolean()
  @Prop({ required: true, default: true })
  available: boolean;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDelete } from '../common/soft-delete.schema';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export type EquipmentDocument = HydratedDocument<Equipment>;

@Schema()
export class Equipment extends SoftDelete {
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
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);

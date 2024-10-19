import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDelete } from '../common/soft-delete.schema';

export type EquipmentDocument = HydratedDocument<Equipment>;

@Schema()
export class Equipment extends SoftDelete {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  unitMeasure: string;

  @Prop()
  inRepair: number;

  @Prop({ required: true, default: true })
  available: boolean;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);

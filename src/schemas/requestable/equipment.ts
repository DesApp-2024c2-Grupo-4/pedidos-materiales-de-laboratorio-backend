import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EquipmentDocument = HydratedDocument<Equipment>;

@Schema()
export class Equipment {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  unitMeasure: string;

  @Prop([
    {
      id: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      quantity: { type: Number },
    },
  ])
  inUse: Array<{
    id: string;
    startDate: Date;
    endDate: Date;
    quantity: number;
  }>;

  @Prop()
  inRepair: number;

  @Prop({ required: true, default: true })
  available: boolean;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);

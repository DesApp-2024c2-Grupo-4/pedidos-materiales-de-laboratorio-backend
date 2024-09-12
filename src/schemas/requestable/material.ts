import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MaterialDocument = HydratedDocument<Material>;

@Schema()
export class Material {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  unitMeasure: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  stock: number;

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
  isAvailable: boolean;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);

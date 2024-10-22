import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDelete } from '../common/soft-delete.schema';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export type MaterialDocument = HydratedDocument<Material>;

@Schema()
export class Material extends SoftDelete {
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
}

export const MaterialSchema = SchemaFactory.createForClass(Material);

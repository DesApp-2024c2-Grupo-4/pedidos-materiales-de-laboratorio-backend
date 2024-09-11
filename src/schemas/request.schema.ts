import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MongooseModels } from '../const/mongoose.const';

export type RequestDocument = HydratedDocument<Request>;

@Schema()
export class SolventRequest {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

@Schema()
export class ReactiveRequest {
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitMeasure: string;

  @Prop({ required: true })
  quality: string;

  @Prop({ required: true })
  concentrationType: string;

  @Prop({ required: true })
  concentrationAmount: string;

  @Prop({ required: true, type: [SolventRequest] })
  solvents: SolventRequest[];

  @Prop({ type: Types.ObjectId, ref: MongooseModels.REACTIVE })
  reactive: Types.ObjectId;
}

@Schema()
export class MaterialRequest {
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true, type: Types.ObjectId, ref: MongooseModels.MATERIAL })
  material: Types.ObjectId;
}

@Schema()
export class Request {
  @Prop({ type: Types.ObjectId, ref: MongooseModels.USER })
  requestantUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: MongooseModels.USER })
  assignedUser: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  requestDate: Date;

  @Prop({ required: true })
  usageDate: Date;

  @Prop()
  labNumber?: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  studentsNumber: number;

  @Prop()
  building?: string;

  @Prop({ required: true })
  groupNumber: number;

  @Prop()
  observations?: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  tpNumber: number;

  @Prop({ type: [Types.ObjectId], ref: MongooseModels.Conversation })
  messages: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: MongooseModels.EQUIPMENT })
  equipments: Types.ObjectId[];

  @Prop({ type: [ReactiveRequest] })
  reactives: ReactiveRequest[];

  @Prop({ type: [MaterialRequest] })
  materials: MaterialRequest[];
}

export const RequestSchema = SchemaFactory.createForClass(Request);

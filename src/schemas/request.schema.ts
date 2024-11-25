import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MongooseModels } from '../const/mongoose.const';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  Labs,
  LabsKeys,
  RequestStatuses,
  RequestStatusesValue,
} from '../request/request.const';
import { IsLabKey } from '../utils/validation/lab.validator';
import { IsObjectId } from 'src/utils/validation/id.validator';

export type RequestDocument = HydratedDocument<Request>;

export interface HasEnoughStockAvailable {
  hasEnoughStockAvailable: (requiredAmount: number) => boolean;
}

@Schema()
export class RequestableElement {
  @IsNumber()
  @Prop({ required: true })
  amount: number;

  @IsNumber()
  @IsOptional()
  @Prop({ required: false })
  missingAmount: number;

  @Prop({ type: Types.ObjectId })
  id: Types.ObjectId;
}

@Schema()
export class SolventRequest {
  @IsString()
  @Prop({ required: true })
  name: string;

  @IsString()
  @Prop({ required: true })
  description: string;
}

@Schema()
export class ReactiveRequest extends RequestableElement {
  @IsString()
  @Prop({ required: true })
  unitMeasure: string;

  @IsString()
  @Prop({ required: true })
  quality: string;

  @IsString()
  @Prop({ required: true })
  concentrationType: string;

  @IsString()
  @Prop({ required: true })
  concentrationAmount: string;

  @Prop({ required: true, type: [SolventRequest] })
  solvents: SolventRequest[];

  @Prop({ type: Types.ObjectId, ref: MongooseModels.REACTIVE })
  id: Types.ObjectId;
}

@Schema()
export class MaterialRequest extends RequestableElement {
  @Prop({ required: true, type: Types.ObjectId, ref: MongooseModels.MATERIAL })
  id: Types.ObjectId;
}

@Schema()
export class EquipmentRequest extends RequestableElement {
  @Prop({ required: true, type: Types.ObjectId, ref: MongooseModels.EQUIPMENT })
  id: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Request {
  /* metadata */
  @IsObjectId()
  @Prop({ type: Types.ObjectId, ref: MongooseModels.USER })
  requestantUser: Types.ObjectId;

  @IsOptional()
  @IsObjectId()
  @Prop({ type: Types.ObjectId, ref: MongooseModels.USER })
  assignedUser?: Types.ObjectId;

  @IsString()
  @Prop({ required: true, enum: Object.keys(RequestStatuses) })
  status: RequestStatusesValue;

  @IsOptional()
  @IsDate()
  @Prop()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Prop()
  updatedAt?: Date;

  /* required info */

  @IsDate()
  @Prop({ required: true })
  startDate: Date;

  @IsDate()
  @Prop({ required: true })
  endDate: Date;

  @IsNumber()
  @Prop({ required: true })
  studentsAmount: number;

  @IsNumber()
  @Prop({ required: true })
  groupsAmount: number;

  @IsString()
  @Prop({ required: true })
  subject: string;

  @IsNumber()
  @Prop({ required: true })
  tpNumber: number;

  @IsString()
  @Prop({ required: true })
  description: string;

  /* lab members optional info */

  @IsOptional()
  @IsLabKey()
  @Prop({ enum: Object.keys(Labs) })
  lab?: LabsKeys;

  @IsString()
  @Prop()
  observations?: string;

  /* comuncation */

  @IsArray()
  @Prop({ type: Types.ObjectId, ref: MongooseModels.Conversation })
  messages: Types.ObjectId;

  /* requestables */

  @IsArray()
  @Prop({ type: [EquipmentRequest] })
  equipments: EquipmentRequest[];

  @IsArray()
  @Prop({ type: [ReactiveRequest] })
  reactives: ReactiveRequest[];

  @IsArray()
  @Prop({ type: [MaterialRequest] })
  materials: MaterialRequest[];

  /* methods */

  isCompleted: () => boolean;
  isRejected: () => boolean;
  isExpired: (secondsToExpire: number) => boolean;
  updateExpiration: (secondsToExpire: number) => void;
}

export const RequestSchema = SchemaFactory.createForClass(Request);

RequestSchema.pre<RequestDocument>('save', async function (next) {
  if (this.isNew) {
    this.status = RequestStatuses.PENDING;
  }
});

RequestSchema.methods.isCompleted = function (): boolean {
  return this.status !== RequestStatuses.COMPLETED;
};

RequestSchema.methods.isRejected = function (): boolean {
  return this.status !== RequestStatuses.REJECTED;
};

RequestSchema.methods.isExpired = function (secondsToExpire: number): boolean {
  return this.createdAt.getTime() + secondsToExpire < Date.now();
};

RequestSchema.methods.updateExpiration = function (
  secondsToExpire: number,
): void {
  if (this.isCompleted()) return;
  if (this.isRejected()) return;
  if (!this.isExpired(secondsToExpire)) return;

  this.status = RequestStatuses.REJECTED;
};

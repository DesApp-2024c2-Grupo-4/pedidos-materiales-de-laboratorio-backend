import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  IsArray,
  IsDate,
  IsEnum,
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
import { IsObjectId } from '../utils/validation/id.validator';
import { Type } from 'class-transformer';
import {
  ReactiveConcentrationTypes,
  ReactiveConcentrationTypesKeys,
  ReactiveQualities,
  ReactiveQualitiesKeys,
  ReactiveSolvents,
  ReactiveSolventsKeys,
  ReactiveUnits,
  ReactiveUnitsKeys,
} from '../reactive/reactive.const';
import { User } from './user.schema';
import { Material } from './requestable/material.schema';
import { Equipment } from './requestable/equipment.schema';
import { Reactive } from './requestable/reactive.schema';
import { Conversation } from './conversation.schema';

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
  @Prop()
  missingAmount?: number;

  @Prop({ type: Types.ObjectId })
  id: Types.ObjectId;
}

@Schema()
export class SolventRequest {
  @IsEnum(ReactiveSolvents, { each: true })
  @Prop({ required: true })
  name: ReactiveSolventsKeys;

  @IsString()
  @Prop({ required: true })
  description: string;
}

@Schema()
export class ReactiveRequest extends RequestableElement {
  @IsEnum(ReactiveUnits, { each: true })
  @Prop({ required: true })
  unitMeasure: ReactiveUnitsKeys;

  @IsEnum(ReactiveQualities, { each: true })
  @Prop({ required: true })
  quality: ReactiveQualitiesKeys;

  @IsEnum(ReactiveConcentrationTypes, { each: true })
  @Prop({ required: true })
  concentrationType: ReactiveConcentrationTypesKeys;

  @IsString()
  @Prop({ required: true })
  concentrationAmount: string;

  @Prop({ required: true, type: [SolventRequest] })
  solvents: SolventRequest[];

  @Prop({ type: Types.ObjectId, ref: Reactive.name })
  id: Types.ObjectId;
}

@Schema()
export class MaterialRequest extends RequestableElement {
  @Prop({ required: true, type: Types.ObjectId, ref: Material.name })
  id: Types.ObjectId;
}

@Schema()
export class EquipmentRequest extends RequestableElement {
  @Prop({ required: true, type: Types.ObjectId, ref: Equipment.name })
  id: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Request {
  /* metadata */
  @IsObjectId()
  @Prop({ type: Types.ObjectId, ref: User.name })
  requestantUser: Types.ObjectId;

  @IsOptional()
  @IsObjectId()
  @Prop({ type: Types.ObjectId, ref: User.name })
  assignedUser?: Types.ObjectId;

  @IsString()
  @IsEnum(RequestStatuses, { each: true })
  @Prop({
    required: true,
    enum: Object.keys(RequestStatuses),
    default: RequestStatuses.PENDING,
  })
  status: RequestStatusesValue;

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

  /* required info */

  @IsDate()
  @Type(() => Date)
  @Prop({ required: true })
  startDate: Date;

  @IsDate()
  @Type(() => Date)
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
  @IsEnum(Object.keys(Labs), { each: true })
  @Prop({ enum: Object.keys(Labs) })
  lab?: LabsKeys;

  @IsString()
  @Prop()
  observations?: string;

  /* comuncation */

  @IsObjectId()
  @Prop({ type: Types.ObjectId, ref: Conversation.name })
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

RequestSchema.pre('find', function () {
  this.populate({
    path: 'equipments.id',
    model: Equipment.name,
  })
    .populate({
      path: 'reactives.id',
      model: Reactive.name,
    })
    .populate({
      path: 'materials.id',
      model: Material.name,
    });
});

RequestSchema.pre('findOne', function () {
  this.populate({
    path: 'equipments.id',
    model: Equipment.name,
  })
    .populate({
      path: 'reactives.id',
      model: Reactive.name,
    })
    .populate({
      path: 'materials.id',
      model: Material.name,
    });
});

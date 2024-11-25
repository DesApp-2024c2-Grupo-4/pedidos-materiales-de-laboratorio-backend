import { Prop, Schema } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { MongooseModels } from '../../const/mongoose.const';
import { IsObjectId } from '../../utils/validation/id.validator';
import { Type } from 'class-transformer';

export const IS_SOFT_DELETED_KEY = 'isSoftDeleted';
export const DELETED_BY_KEY = 'deletedBy';
export const DELETION_DATE_KEY = 'deletionDate';

@Schema()
export class SoftDelete {
  @IsOptional()
  @IsBoolean()
  @Prop({ type: Boolean })
  [IS_SOFT_DELETED_KEY]?: boolean;

  @IsOptional()
  @IsObjectId({ message: 'Id should be in Mongo ObjectId format' })
  @Prop({ required: false, type: Types.ObjectId, ref: MongooseModels.USER })
  deletedBy?: Types.ObjectId;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Prop({ required: false, type: Date })
  deletionDate?: Date;
}

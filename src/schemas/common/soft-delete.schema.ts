import { Prop, Schema } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { MongooseModels } from '../../const/mongoose.const';
import { IsObjectId } from '../../utils/validation/id.validator';

export const IS_SOFT_DELETED_KEY = 'isSoftDeleted';

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
  @Prop({ required: false, type: Date })
  deletionDate?: Date;
}

import { Types } from 'mongoose';
import { IsObjectId } from '../utils/validation/id.validator';
export class IdDto {
  @IsObjectId({ message: 'Id should be in Mongo ObjectId format' })
  id: Types.ObjectId;
}

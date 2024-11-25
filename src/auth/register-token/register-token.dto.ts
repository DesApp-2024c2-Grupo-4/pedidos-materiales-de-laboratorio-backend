import { PickType } from '@nestjs/mapped-types';
import { RegisterToken } from '../../schemas/register-token.schema';
import { Types } from 'mongoose';
import { IsObjectId } from '../../utils/validation/id.validator';

export class CreateRegisterTokenDto extends PickType(RegisterToken, [
  'createdFor',
]) {}

export class RegisterTokenIdDto {
  @IsObjectId({ message: 'token should be in Mongo ObjectId format' })
  token: Types.ObjectId;
}

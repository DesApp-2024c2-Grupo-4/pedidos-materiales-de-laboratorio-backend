import { PickType } from '@nestjs/mapped-types';
import { RegisterToken } from '../schemas/register-token.schema';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { IsObjectId } from '../utils/id-validator';

export class CreateRegisterTokenDto extends PickType(RegisterToken, [
  'createdFor',
]) {}

export class GetRegisterTokenDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value.toLowerCase() === 'true')
  isAvailable?: boolean;
}

export class RegisterTokenIdDto {
  @IsObjectId({ message: 'token should be in Mongo ObjectId format' })
  token: Types.ObjectId;
}

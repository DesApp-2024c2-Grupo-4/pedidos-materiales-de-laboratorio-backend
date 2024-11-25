import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Request } from '../schemas/request.schema';

export class CreateRequestDto extends OmitType(Request, [
  'requestantUser',
  'assignedUser',
  'status',
  'createdAt',
  'updatedAt',
  'lab',
  'observations',
  'messages',
]) {}

export class UpdateRequestDto extends OmitType(Request, [
  'requestantUser',
  'createdAt',
  'updatedAt',
  'messages',
]) {}

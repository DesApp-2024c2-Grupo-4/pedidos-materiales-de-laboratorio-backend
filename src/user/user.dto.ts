import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../schemas/user.schema';

export class UserLoginDto extends PickType(User, ['email', 'password']) {}

export class CreateUserDto extends OmitType(User, [
  'createdAt',
  'updatedAt',
  'roles',
  'comparePassword',
]) {}

export class UpdateUserDto extends PartialType(
  OmitType(User, ['createdAt', 'updatedAt', 'comparePassword']),
) {}

export class UpdateSelfUserDto extends PartialType(
  OmitType(UpdateUserDto, ['email', 'dni', 'licenceNumber', 'roles']),
) {}

import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { User } from 'src/schemas/user.schema';

export class UserLoginDto extends PickType(User, ['email', 'password']) {}

export class CreateUserDto extends OmitType(User, [
  'createdAt',
  'updatedAt',
  'roles',
  'comparePassword',
]) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

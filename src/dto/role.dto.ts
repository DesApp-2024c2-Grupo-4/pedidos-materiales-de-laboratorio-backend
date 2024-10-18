
import { PartialType } from '@nestjs/mapped-types';
import { Role } from '../schemas/role.schema';
import { Types } from 'mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';


export class UpdateRoleDto extends PartialType(Role) {}

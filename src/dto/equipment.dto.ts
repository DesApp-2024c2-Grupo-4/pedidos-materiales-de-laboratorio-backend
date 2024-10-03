
import { PartialType } from '@nestjs/mapped-types';
import { Equipment } from '../schemas/requestable/equipment.schema';
import { Types } from 'mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';


export class UpdateEquipmentDto extends PartialType(Equipment) {}

import { PartialType } from '@nestjs/mapped-types';
import { Material } from '../schemas/requestable/material.schema';
import { Types } from 'mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';


export class UpdateMaterialDto extends PartialType(Material) {}

export class quantityMaterialDto extends (Material) {
    @IsNumber()
    availableStock: Number;
}

import { PartialType } from '@nestjs/mapped-types';
import { Material } from '../schemas/requestable/material.schema';
import { IsNumber } from 'class-validator';

export class UpdateMaterialDto extends PartialType(Material) {}

export class quantityMaterialDto extends Material {
  @IsNumber()
  availableStock: Number;
}

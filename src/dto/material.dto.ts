import { PartialType } from '@nestjs/mapped-types';
import { Material } from '../schemas/requestable/material.schema';

export class UpdateMaterialDto extends PartialType(Material) {}

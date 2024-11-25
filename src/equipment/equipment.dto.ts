import { PartialType } from '@nestjs/mapped-types';
import { Equipment } from '../schemas/requestable/equipment.schema';
import { IsNumber } from 'class-validator';

export class UpdateEquipmentDto extends PartialType(Equipment) {}

export class quantityEquipmentDto extends Equipment {
  @IsNumber()
  availableStock: number;
}

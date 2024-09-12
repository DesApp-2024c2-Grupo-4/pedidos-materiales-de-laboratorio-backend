import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { Equipment } from 'src/schemas/requestable/equipment.schema';
import { Types } from 'mongoose';

@Controller('/equipment')
export class EquipmentController {
  constructor(private EquipmentService: EquipmentService) {}

  @Post()
  createEquipment(@Body() equipment: Equipment) {
    return this.EquipmentService.createEquipment(equipment);
  }

  @Get()
  getAll() {
    return this.EquipmentService.getEquipments();
  }

  @Get('/:id')
  GetEquipmentById(@Param('id') id: Types.ObjectId) {
    return this.EquipmentService.getEquipmentById(id);
  }

  @Delete('/:id')
  DeleteEquipmentById(@Param('id') id: Types.ObjectId) {
    return this.EquipmentService.deleteEquipmentById(id);
  }

  @Put('/:id')
  UpdateEquipmentById(
    @Param('id') id: Types.ObjectId,
    @Body() equipment: Equipment,
  ) {
    return this.EquipmentService.updateEquipmentById(id, equipment);
  }
}

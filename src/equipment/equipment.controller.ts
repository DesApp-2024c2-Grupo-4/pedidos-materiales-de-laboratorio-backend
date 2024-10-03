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
import { IdDto } from 'src/dto/id.dto';
import { UpdateEquipmentDto } from 'src/dto/equipment.dto'
@Controller('/equipment')
export class EquipmentController {
  constructor(private EquipmentService: EquipmentService) {}

  @Post()
  createEquipment(@Body() equipment: Equipment) {
    return this.EquipmentService.add(equipment);
  }

  @Get()
  getAll() {
    return this.EquipmentService.getAll();
  }

  @Get('/:id')
    get(@Param() params: IdDto) {
    return this.EquipmentService.get(params.id);
  }

  @Delete('/:id')
  DeleteEquipmentById(@Param() params: IdDto) {
    return this.EquipmentService.delete(params.id);
  }

  @Put('/:id')
  UpdateEquipmentById(
     @Param() params: IdDto,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    return this.EquipmentService.update(params.id, updateEquipmentDto);
  }
}

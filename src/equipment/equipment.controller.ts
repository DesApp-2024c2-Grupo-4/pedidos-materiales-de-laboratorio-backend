import {
  Request,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { Equipment } from '../schemas/requestable/equipment.schema';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../dto/authenticated-request.dto';
import { IdDto } from '../dto/id.dto';

@Controller('/equipment')
export class EquipmentController {
  constructor(private EquipmentService: EquipmentService) {}

  @Post()
  add(@Body() equipment: Equipment) {
    return this.EquipmentService.add(equipment);
  }

  @Get()
  getAll() {
    return this.EquipmentService.getAll();
  }

  @Get('/:id')
  get(@Param('id') id: Types.ObjectId) {
    return this.EquipmentService.get(id);
  }

  @Delete('/:id')
  delete(@Request() req: AuthenticatedRequest, @Param() params: IdDto) {
    const { id } = req.user;
    return this.EquipmentService.delete(params.id, id);
  }

  @Put('/:id')
  update(@Param('id') id: Types.ObjectId, @Body() equipment: Equipment) {
    return this.EquipmentService.update(id, equipment);
  }
}

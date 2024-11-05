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
import { AllRoles, AnyRoles } from '../auth/providers/accesor.metadata';
import { Roles } from '../const/roles.const';

@Controller('/equipment')
export class EquipmentController {
  constructor(private EquipmentService: EquipmentService) {}

  @Post()
  @AllRoles(Roles.LAB)
  add(@Body() equipment: Equipment) {
    return this.EquipmentService.add(equipment);
  }

  @Get()
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  getAll() {
    return this.EquipmentService.getAll();
  }

  @Get('/:id')
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  get(@Param('id') id: Types.ObjectId) {
    return this.EquipmentService.get(id);
  }

  @Delete('/:id')
  @AllRoles(Roles.LAB)
  delete(@Request() req: AuthenticatedRequest, @Param() params: IdDto) {
    const { id } = req.user;
    return this.EquipmentService.delete(params.id, id);
  }

  @Put('/:id')
  @AllRoles(Roles.LAB)
  update(@Param('id') id: Types.ObjectId, @Body() equipment: Equipment) {
    return this.EquipmentService.update(id, equipment);
  }
}

import {
  Request,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { Equipment } from '../schemas/requestable/equipment.schema';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../dto/authenticated-request.dto';
import { IdDto } from '../dto/id.dto';
import { AllRoles, AnyRoles } from '../auth/providers/accesor.metadata';
import { Roles } from '../const/roles.const';
import { EquipmentTypes } from './equipment.const';
import { UpdateEquipmentDto } from '../dto/equipment.dto';
import { IsAvailableDto } from '../dto/is-available.dto';

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
  getAll(@Query() isAvailableDto: IsAvailableDto) {
    const { isAvailable } = isAvailableDto;

    return this.EquipmentService.getAll(isAvailable);
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
  update(
    @Param('id') id: Types.ObjectId,
    @Body() equipment: UpdateEquipmentDto,
  ) {
    return this.EquipmentService.update(id, equipment);
  }

  @Get('/constants/types')
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  getTypes() {
    return EquipmentTypes;
  }
}

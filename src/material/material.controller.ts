import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { Material } from '../schemas/requestable/material.schema';
import { IdDto } from '../dto/id.dto';
import { UpdateMaterialDto } from '../dto/material.dto';
import { AuthenticatedRequest } from '../dto/authenticated-request.dto';
import { AllRoles, AnyRoles } from '../auth/providers/accesor.metadata';
import { Roles } from '../const/roles.const';
import { MaterialTypes } from './material.const';
import { IsAvailableDto } from '../dto/is-available.dto';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @HttpCode(201)
  @Post()
  @AllRoles(Roles.LAB)
  add(@Body() material: Material) {
    return this.materialService.add(material);
  }

  @Put('/:id')
  @AllRoles(Roles.LAB)
  update(@Param() params: IdDto, @Body() material: UpdateMaterialDto) {
    return this.materialService.update(params.id, material);
  }

  @Get('/:id')
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  get(@Param() params: IdDto) {
    return this.materialService.get(params.id);
  }

  @Get()
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  getAll(@Query() isAvailableDto: IsAvailableDto) {
    const { isAvailable } = isAvailableDto;
    return this.materialService.getAll(isAvailable);
  }

  @Delete('/:id')
  @AllRoles(Roles.LAB)
  delete(@Request() req: AuthenticatedRequest, @Param() params: IdDto) {
    const { id: deletedBy } = req.user;
    return this.materialService.delete(params.id, deletedBy);
  }

  @Get('/constants/types')
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  getTypes() {
    return MaterialTypes;
  }
}

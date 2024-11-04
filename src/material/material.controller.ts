import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { Material } from '../schemas/requestable/material.schema';
import { IdDto } from '../dto/id.dto';
import { UpdateMaterialDto } from '../dto/material.dto';
import { AuthenticatedRequest } from '../dto/authenticated-request.dto';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @HttpCode(201)
  @Post()
  add(@Body() material: Material) {
    return this.materialService.add(material);
  }

  @Put('/:id')
  update(@Param() params: IdDto, @Body() material: UpdateMaterialDto) {
    return this.materialService.update(params.id, material);
  }

  @Get('/:id')
  get(@Param() params: IdDto) {
    return this.materialService.get(params.id);
  }

  @Get()
  getAll() {
    return this.materialService.getAll();
  }

  @Delete('/:id')
  delete(@Request() req: AuthenticatedRequest, @Param() params: IdDto) {
    const { id: deletedBy } = req.user;
    return this.materialService.delete(params.id, deletedBy);
  }
}

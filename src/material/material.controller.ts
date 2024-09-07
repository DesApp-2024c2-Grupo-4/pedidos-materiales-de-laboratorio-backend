import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { Types } from 'mongoose';
import { Material } from 'src/schemas/requestable/material.schema';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @HttpCode(201)
  @Post()
  add(@Body('material') material: Material) {
    this.materialService.add(material);
  }

  @Put('/:id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body('material') material: Material,
  ) {
    this.materialService.update(id, material);
  }

  @Get('/:id')
  get(@Param('id') id: Types.ObjectId) {
    this.materialService.get(id);
  }

  @Get()
  getAll() {
    this.materialService.getAll();
  }

  @Delete('/:id')
  delete(@Param('id') id: Types.ObjectId) {
    this.materialService.delete(id);
  }
}

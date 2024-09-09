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
import {
  Material,
  UpdateMaterialDto,
} from '../schemas/requestable/material.schema';
import { IdDto } from 'src/dto/id.dto';

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
  delete(@Param() params: IdDto) {
    return this.materialService.delete(params.id);
  }
}

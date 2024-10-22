import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ReactiveService } from './reactive.service';
import { Reactive } from '../schemas/requestable/reactive.schema';
import { IdDto } from '../dto/id.dto';
import { UpdateReactivelDto } from '../dto/reactive.dto';

@Controller('/reactive')
export class ReactiveController {
  constructor(private ReactiveService: ReactiveService) {}

  @Post()
  add(@Body() reactive: Reactive) {
    return this.ReactiveService.add(reactive);
  }

  @Get()
  getAll() {
    return this.ReactiveService.getAll();
  }

  @Get('/:id')
  get(@Param() params: IdDto) {
    return this.ReactiveService.get(params.id);
  }

  @Put('/:id')
  update(
    @Param() params: IdDto,
    @Body() updateReactiveDto: UpdateReactivelDto,
  ) {
    return this.ReactiveService.update(params.id, updateReactiveDto);
  }

  @Delete('/:id')
  delete(@Param() params: IdDto) {
    return this.ReactiveService.delete(params.id);
  }
}

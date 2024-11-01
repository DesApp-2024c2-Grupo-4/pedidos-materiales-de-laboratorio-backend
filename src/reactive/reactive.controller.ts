import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ReactiveService } from './reactive.service';
import { Reactive } from '../schemas/requestable/reactive.schema';
import { IdDto } from '../dto/id.dto';
import { UpdateReactivelDto } from '../dto/reactive.dto';
import { AuthenticatedRequest } from '../dto/authenticated-request.dto';

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
  delete(@Request() req: AuthenticatedRequest, @Param() params: IdDto) {
    const { id } = req.user;
    return this.ReactiveService.delete(params.id, id);
  }
}

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
import { AllRoles, AnyRoles } from '../auth/providers/accesor.metadata';
import { Roles } from '../const/roles.const';

@Controller('/reactive')
export class ReactiveController {
  constructor(private ReactiveService: ReactiveService) {}

  @Post()
  @AllRoles(Roles.LAB)
  add(@Body() reactive: Reactive) {
    return this.ReactiveService.add(reactive);
  }

  @Get()
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  getAll() {
    return this.ReactiveService.getAll();
  }

  @Get('/:id')
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  get(@Param() params: IdDto) {
    return this.ReactiveService.get(params.id);
  }

  @Put('/:id')
  @AllRoles(Roles.LAB)
  update(
    @Param() params: IdDto,
    @Body() updateReactiveDto: UpdateReactivelDto,
  ) {
    return this.ReactiveService.update(params.id, updateReactiveDto);
  }

  @Delete('/:id')
  @AllRoles(Roles.LAB)
  delete(@Request() req: AuthenticatedRequest, @Param() params: IdDto) {
    const { id } = req.user;
    return this.ReactiveService.delete(params.id, id);
  }
}

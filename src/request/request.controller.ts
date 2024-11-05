import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request as NestRequest,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { Request } from '../schemas/request.schema';
import { IdDto } from '../dto/id.dto';
import { UpdateRequestDto } from '../dto/request.dto';
import { AuthenticatedRequest } from '../dto/authenticated-request.dto';
import { Roles } from '../const/roles.const';
import { AllRoles, AnyRoles } from '../auth/providers/accesor.metadata';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @HttpCode(201)
  @Post()
  @AllRoles(Roles.TEACHER)
  add(@Body() request: Request) {
    return this.requestService.add(request);
  }

  @Put('/:id')
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  update(@Param() params: IdDto, @Body() request: UpdateRequestDto) {
    return this.requestService.update(params.id, request);
  }

  @Get('/:id')
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  get(@Param() params: IdDto) {
    return this.requestService.get(params.id);
  }

  @Get()
  @AllRoles(Roles.LAB)
  getAll() {
    return this.requestService.getAll();
  }

  @Delete('/:id')
  @AllRoles(Roles.LAB)
  delete(@NestRequest() req: AuthenticatedRequest, @Param() params: IdDto) {
    const { id } = req.user;
    return this.requestService.delete(params.id, id);
  }
}

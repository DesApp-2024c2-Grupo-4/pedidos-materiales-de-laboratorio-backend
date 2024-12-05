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
  Query,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { IdDto } from '../dto/id.dto';
import { CreateRequestDto, UpdateRequestDto } from './request.dto';
import { AuthenticatedRequest } from '../dto/authenticated-request.dto';
import { Roles } from '../const/roles.const';
import { AllRoles, AnyRoles } from '../auth/providers/accesor.metadata';
import { Labs, RequestStatuses } from './request.const';
import { StatusDto } from '../dto/status.dto';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @HttpCode(201)
  @Post()
  @AllRoles(Roles.TEACHER)
  add(
    @Body() createRequestDto: CreateRequestDto,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    const { id } = req.user;
    return this.requestService.add(id, createRequestDto);
  }

  @Put('/:id')
  @AllRoles(Roles.LAB)
  update(@Param() params: IdDto, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(params.id, updateRequestDto);
  }

  @Get('/:id')
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  get(@Param() params: IdDto) {
    return this.requestService.get(params.id);
  }

  @Get()
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  getAll(
    @NestRequest() req: AuthenticatedRequest,
    @Query() statusDto: StatusDto,
  ) {
    const { roles, id } = req.user;
    const { status } = statusDto;
    const isLabUser = roles
      .map((r) => r.toLowerCase())
      .includes(Roles.LAB.toLowerCase());
    const requestantUser = isLabUser ? undefined : id;
    return this.requestService.getAll(requestantUser, status);
  }

  @Get('/constants/statuses')
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  getStatuses() {
    return RequestStatuses;
  }

  @Get('/constants/labs')
  @AnyRoles(Roles.LAB, Roles.TEACHER)
  getLabs() {
    return Labs;
  }

  @Delete('/:id')
  @AllRoles(Roles.LAB)
  delete(@NestRequest() req: AuthenticatedRequest, @Param() params: IdDto) {
    const { id } = req.user;
    return this.requestService.delete(params.id, id);
  }
}

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

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @HttpCode(201)
  @Post()
  add(@Body() request: Request) {
    return this.requestService.add(request);
  }

  @Put('/:id')
  update(@Param() params: IdDto, @Body() request: UpdateRequestDto) {
    return this.requestService.update(params.id, request);
  }

  @Get('/:id')
  get(@Param() params: IdDto) {
    return this.requestService.get(params.id);
  }

  @Get()
  getAll() {
    return this.requestService.getAll();
  }

  @Delete('/:id')
  delete(@NestRequest() req: AuthenticatedRequest, @Param() params: IdDto) {
    const { id } = req.user;
    return this.requestService.delete(params.id, id);
  }
}

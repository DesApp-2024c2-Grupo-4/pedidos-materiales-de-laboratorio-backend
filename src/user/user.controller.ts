import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IdDto } from '../dto/id.dto';
import { UpdateUserDto } from '../dto/user.dto';
import { AuthenticatedRequest } from '../dto/authenticated-request.dto';

@Controller('material')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/:id')
  update(@Param() params: IdDto, @Body() user: UpdateUserDto) {
    return this.userService.update(params.id, user);
  }

  @Get('/:id')
  get(@Param() params: IdDto) {
    return this.userService.get(params.id);
  }

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Delete('/:id')
  delete(@Request() req: AuthenticatedRequest, @Param() params: IdDto) {
    const { id } = req.user;
    return this.userService.delete(params.id, id);
  }
}

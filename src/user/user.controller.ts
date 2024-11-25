import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IdDto } from '../dto/id.dto';
import { UpdateSelfUserDto, UpdateUserDto } from '../dto/user.dto';
import { AuthenticatedRequest } from '../dto/authenticated-request.dto';
import { AllRoles, AnyRoles } from '../auth/providers/accesor.metadata';
import { Roles } from '../const/roles.const';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put()
  updateSameUser(
    @Body() user: UpdateSelfUserDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const { id } = request.user;
    return this.userService.update(id, user);
  }

  @AllRoles(Roles.ADMIN)
  @Put('/:id')
  update(@Param() params: IdDto, @Body() user: UpdateUserDto) {
    return this.userService.update(params.id, user);
  }

  @AllRoles(Roles.ADMIN)
  @Get('/:id')
  get(@Param() params: IdDto) {
    return this.userService.get(params.id);
  }

  @AllRoles(Roles.ADMIN)
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @AllRoles(Roles.ADMIN)
  @Delete('/:id')
  delete(@Request() req: AuthenticatedRequest, @Param() params: IdDto) {
    const { id } = req.user;
    return this.userService.delete(params.id, id);
  }
}

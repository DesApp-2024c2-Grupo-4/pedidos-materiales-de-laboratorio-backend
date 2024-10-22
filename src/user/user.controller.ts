import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { IdDto } from '../dto/id.dto';
import { UpdateUserDto } from '../dto/user.dto';

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
  delete(@Param() params: IdDto) {
    return this.userService.delete(params.id);
  }
}

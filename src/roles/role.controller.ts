import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { RoleService } from 'src/roles/role.service';
import { Types } from 'mongoose';
import { Request } from 'express';
import { AccessTokenPayload } from 'src/types/jwt-payload';
import { IdDto } from 'src/dto/id.dto';
import {UpdateRoleDto } from  'src/dto/role.dto'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/:user')
  get(@Param('user') params: IdDto) {
    return this.roleService.getUser(params.id);
  }

  @Get()
  getAll() {
    return this.roleService.getAll();
  }

  @Put('/:id')
  update(@Param('user') params: IdDto, @Body() role: UpdateRoleDto) {
    return this.roleService.update(params.id, role);
  }


}

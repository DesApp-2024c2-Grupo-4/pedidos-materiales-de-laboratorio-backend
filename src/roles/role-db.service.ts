import { Injectable } from '@nestjs/common';
import { Role } from '../schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import handlePromise from '../utils/promise';
import {
  cantGet,
  cantGetRoles,
  cantUpdate,
} from './role.error';
import { Model, Types } from 'mongoose';
import { IS_SOFT_DELETED_KEY } from '../schemas/common/soft-delete.schema';
import { UpdateRoleDto } from '../dto/role.dto';

@Injectable()
export class RoleDbService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}db


  async update(id: Types.ObjectId, role: UpdateRoleDto) {
    const [, err] = await handlePromise(
      this.roleModel.updateOne({ _id: id }, role),
    );

    if (err) {
      return new Error(cantUpdate(id, err));
    }
  }

  async getUser(id: Types.ObjectId) {
    const [role, err] = await handlePromise(
      this.roleModel.findOne({ _id: id }),
    );

    if (err) {
      return new Error(cantGet(id, err));
    }

    return role;
  }

  async getAll() {
    const [roles, err] = await handlePromise(this.roleModel.find());

    if (err) {
      return new Error(cantGetRoles(err));
    }

    return roles;
  }
}

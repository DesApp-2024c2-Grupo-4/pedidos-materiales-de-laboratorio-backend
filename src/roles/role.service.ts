import { HttpStatus, Injectable } from '@nestjs/common';
import { RoleDbService } from './role-db.service';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Role } from '../schemas/role.schema';
import { Types } from 'mongoose';
import { UpdateRoleDto } from '../dto/role.dto';
import { IdDto } from 'src/dto/id.dto';

@Injectable()
export class RoleService {
  constructor(private readonly dbService: RoleDbService) {}


  async update(id: Types.ObjectId, role: UpdateRoleDto) {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.update(id, role),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser(id: Types.ObjectId) {
    const [role, err] = await handlePromise<unknown, Error>(
      this.dbService.getUser(id),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!role) {
      return new BackendException('', HttpStatus.NOT_FOUND);
    }

    return role;
  }

  async getAll() {
    const [roles, err] = await handlePromise<unknown, Error>(
      this.dbService.getAll(),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return roles;
  }
}

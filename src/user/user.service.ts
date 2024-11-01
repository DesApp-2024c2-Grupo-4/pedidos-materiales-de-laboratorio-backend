import { HttpStatus, Injectable } from '@nestjs/common';
import { UserDbService } from './user-db.service';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Types } from 'mongoose';
import { UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly dbService: UserDbService) {}

  async update(id: Types.ObjectId, user: UpdateUserDto) {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.update(id, user),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async get(id: Types.ObjectId) {
    const [user, err] = await handlePromise<unknown, Error>(
      this.dbService.get(id),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!user) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getAll() {
    const [users, err] = await handlePromise<unknown, Error>(
      this.dbService.getAll(),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return users;
  }

  async delete(id: Types.ObjectId, deletedBy: Types.ObjectId) {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.delete(id, deletedBy),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

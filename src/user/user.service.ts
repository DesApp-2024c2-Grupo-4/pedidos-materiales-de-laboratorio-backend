import { HttpStatus, Injectable } from '@nestjs/common';
import { UserDbService } from './user-db.service';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Types } from 'mongoose';
import { UpdateUserDto } from '../dto/user.dto';
import { IS_SOFT_DELETED_KEY } from '../schemas/common/soft-delete.schema';
import { UserDocument } from '../schemas/user.schema';

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

  async get(id: Types.ObjectId): Promise<UserDocument> {
    const [user, err] = await handlePromise<UserDocument, Error>(
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
    const [user, getErr] = await handlePromise<UserDocument, Error>(
      this.dbService.get(id),
    );

    if (getErr) {
      throw new BackendException(
        getErr.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (user[IS_SOFT_DELETED_KEY]) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.delete(user, deletedBy),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

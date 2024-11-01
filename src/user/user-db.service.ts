import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model, Types } from 'mongoose';
import handlePromise from '../utils/promise';
import {
  cantCreateUser,
  cantDelete,
  cantGeteUserByEmail,
  cantGetUser,
  cantGetUsers,
  cantUpdate,
} from './user.errors';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { IS_SOFT_DELETED_KEY } from '../schemas/common/soft-delete.schema';

@Injectable()
export class UserDbService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User> {
    const [user, err] = await handlePromise(
      this.userModel.findOne({
        email,
      }),
    );

    if (err) {
      return Promise.reject(cantGeteUserByEmail(email, err));
    }

    return user;
  }

  async get(id: Types.ObjectId): Promise<User> {
    const [user, err] = await handlePromise(
      this.userModel.findOne({
        _id: id,
      }),
    );

    if (err) {
      return Promise.reject(cantGetUser(id, err));
    }

    return user;
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const [_user, err] = await handlePromise(this.userModel.create(user));

    if (err) {
      return Promise.reject(cantCreateUser(user.email, err));
    }

    return _user;
  }

  async getAll() {
    const [materials, err] = await handlePromise(this.userModel.find());

    if (err) {
      return Promise.reject(cantGetUsers(err));
    }

    return materials;
  }

  async update(id: Types.ObjectId, material: UpdateUserDto) {
    const [, err] = await handlePromise(
      this.userModel.updateOne({ _id: id }, material),
    );

    if (err) {
      return Promise.reject(cantUpdate(id, err));
    }
  }

  async delete(id: Types.ObjectId, deletedBy: Types.ObjectId): Promise<void> {
    const softDelete = {
      [IS_SOFT_DELETED_KEY]: true,
      deletedBy,
      deletionDate: new Date(Date.now()),
    };

    const [, err] = await handlePromise(
      this.userModel.updateOne({ _id: id }, { $set: softDelete }),
    );

    if (err) {
      return Promise.reject(cantDelete(id, err));
    }
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return user.comparePassword(password);
  }
}

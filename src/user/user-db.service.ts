import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model, Types } from 'mongoose';
import handlePromise from '../utils/promise';
import {
  cantCreateUser,
  cantGeteUserByEmail,
  cantGetUser,
} from './user.errors';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User> {
    const [user, err] = await handlePromise(
      this.userModel.findOne({
        email,
      }),
    );

    if (err) {
      throw new Error(cantGeteUserByEmail(email, err));
    }

    return user;
  }

  async findById(id: Types.ObjectId): Promise<User> {
    const [user, err] = await handlePromise(
      this.userModel.findOne({
        _id: id,
      }),
    );

    if (err) {
      throw new Error(cantGetUser(id, err));
    }

    return user;
  }

  async createUser(user: User): Promise<User> {
    const [_user, err] = await handlePromise(this.userModel.create(user));

    if (err) {
      throw new Error(cantCreateUser(user.email, err));
    }

    return _user;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return user.comparePassword(password);
  }
}

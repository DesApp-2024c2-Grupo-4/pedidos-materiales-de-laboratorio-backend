import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import * as mongoose from 'mongoose';
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
import { RegisterTokenDocument } from '../schemas/register-token.schema';
import { IdDto } from '../dto/id.dto';

@Injectable()
export class UserDbService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

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

  async createUser(
    user: CreateUserDto,
    token: RegisterTokenDocument,
  ): Promise<IdDto> {
    const [session, sessionError] = await handlePromise(
      this.connection.startSession(),
    );

    if (sessionError) {
      return Promise.reject(
        cantCreateUser(user.email, `Error starting session: ${sessionError}`),
      );
    }

    session.startTransaction();

    const _user = new this.userModel(user);

    const [savedUser, err] = await handlePromise(_user.save({ session }));

    if (err) {
      await handlePromise(session.abortTransaction());
      await handlePromise(session.endSession());
      return Promise.reject(cantCreateUser(user.email, err));
    }

    token.consume(savedUser._id);

    const [, saveTokenErr] = await handlePromise(token.save({ session }));

    if (saveTokenErr) {
      await handlePromise(session.abortTransaction());
      await handlePromise(session.endSession());
      return Promise.reject(
        cantCreateUser(user.email, `Cannot save token: ${saveTokenErr}`),
      );
    }

    const [, commitError] = await handlePromise(session.commitTransaction());

    if (commitError) {
      await handlePromise(session.abortTransaction());
      session.endSession();
      return Promise.reject(
        cantCreateUser(
          user.email,
          `Error committing transaction: ${commitError}`,
        ),
      );
    }

    return { id: savedUser._id };
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

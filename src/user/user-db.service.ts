import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model, Types, Connection } from 'mongoose';
import handlePromise from '../utils/promise';
import {
  cantCreateUser,
  cantDelete,
  cantGeteUserByEmail,
  cantGetUser,
  cantGetUsers,
  cantUpdate,
} from './user.errors';
import { CreateUserDto, UpdateSelfUserDto, UpdateUserDto } from './user.dto';
import {
  DELETED_BY_KEY,
  DELETION_DATE_KEY,
  IS_SOFT_DELETED_KEY,
} from '../schemas/common/soft-delete.schema';
import { RegisterTokenDocument } from '../schemas/register-token.schema';
import { IdDto } from '../dto/id.dto';

@Injectable()
export class UserDbService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
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

  async get(id: Types.ObjectId): Promise<UserDocument> {
    const [user, err] = await handlePromise(
      this.userModel.findById(id, { password: 0 }),
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
    if (token.createdFor) {
      if (token.createdFor !== user.email) {
        return Promise.reject(
          cantCreateUser(
            user.email,
            `Token is not allowed for requested email address`,
          ),
        );
      }
    }

    const finalUser = token.roles ? { ...user, roles: token.roles } : user;

    const [session, sessionError] = await handlePromise(
      this.connection.startSession(),
    );

    if (sessionError) {
      return Promise.reject(
        cantCreateUser(
          finalUser.email,
          `Error starting session: ${sessionError}`,
        ),
      );
    }

    session.startTransaction();

    const [_user, err] = await handlePromise(
      this.userModel.create([finalUser], { session }),
    );

    if (err) {
      await handlePromise(session.abortTransaction());
      await handlePromise(session.endSession());
      return Promise.reject(cantCreateUser(finalUser.email, err));
    }

    const [savedUser] = _user;

    token.consume(savedUser._id);

    const [, saveTokenErr] = await handlePromise(token.save({ session }));

    if (saveTokenErr) {
      await handlePromise(session.abortTransaction());
      await handlePromise(session.endSession());
      return Promise.reject(
        cantCreateUser(finalUser.email, `Cannot save token: ${saveTokenErr}`),
      );
    }

    const [, commitError] = await handlePromise(session.commitTransaction());

    if (commitError) {
      await handlePromise(session.abortTransaction());
      session.endSession();
      return Promise.reject(
        cantCreateUser(
          finalUser.email,
          `Error committing transaction: ${commitError}`,
        ),
      );
    }

    return { id: savedUser._id };
  }

  async getAll() {
    const [users, err] = await handlePromise(
      this.userModel.find({}, { password: 0 }),
    );

    if (err) {
      return Promise.reject(cantGetUsers(err));
    }

    return users;
  }

  async update(dbUser: UserDocument, user: UpdateUserDto | UpdateSelfUserDto) {
    for (let k in user) {
      dbUser[k] = user[k];
    }

    const [, err] = await handlePromise(dbUser.save());

    if (err) {
      return Promise.reject(cantUpdate(dbUser._id, err));
    }
  }

  async delete(user: UserDocument, deletedBy: Types.ObjectId): Promise<void> {
    user[IS_SOFT_DELETED_KEY] = true;
    user[DELETED_BY_KEY] = deletedBy;
    user[DELETION_DATE_KEY] = new Date(Date.now());

    const [, err] = await handlePromise(user.save());

    if (err) {
      return Promise.reject(cantDelete(user._id, err));
    }
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return user.comparePassword(password);
  }
}

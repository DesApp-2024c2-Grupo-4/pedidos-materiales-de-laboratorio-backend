import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user';
import { Model } from 'mongoose';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';

@Injectable()
export default class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async registerUser(user: User) {
    const [dbUser, getUserErr] = await handlePromise(
      this.findByUsername(user.username),
    );

    if (getUserErr) {
      throw getUserErr;
    }

    if (dbUser) {
      // FIXME: return 400 user already exists
      throw new BackendException(`Username ${user.username} already exists.`);
    }

    const [newUser, createUserErr] = await handlePromise(
      this.userModel.create(user),
    );

    if (createUserErr) {
      throw new BackendException(
        `Cannot create user ${user.username}. Reason: ${createUserErr}`,
      );
    }

    return newUser;
  }

  async findByUsername(username: string) {
    const [user, err] = await handlePromise(
      this.userModel.findOne({
        username,
      }),
    );

    if (err) {
      throw new BackendException(`Cannot get user ${username}. Reason: ${err}`);
    }

    return user;
  }
}

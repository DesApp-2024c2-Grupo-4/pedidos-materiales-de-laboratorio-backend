import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { UserDbService } from '../user/user-db.service';
import { AccessTokenPayload } from '../types/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/user.dto';
import { Document, Types } from 'mongoose';
import { RegisterTokenDbService } from './register-token/register-token-db.service';
import { IdDto } from '../dto/id.dto';
import {
  RegisterToken,
  RegisterTokenDocument,
} from '../schemas/register-token.schema';
import { cantCreateUser } from '../user/user.errors';
import { cantDeleteToken } from './register-token/register-token.errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserDbService,
    private readonly registerTokenService: RegisterTokenDbService,
    private readonly accessTokenService: JwtService,
  ) {}

  public async registerUser(user: CreateUserDto, tokenId: Types.ObjectId) {
    const [dbUser, getUserErr] = await handlePromise(
      this.userService.findByEmail(user.email),
    );

    if (getUserErr) {
      throw new BackendException(
        `Cannot create user ${user.email}. Reason: ${getUserErr}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (dbUser) {
      throw new BackendException(
        `Username ${user.email} already exists.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const [token, getTokenErr] = await handlePromise(
      this.registerTokenService.get(tokenId),
    );

    if (getTokenErr) {
      throw new BackendException(
        cantCreateUser(user.email, `Error getting token: ${getTokenErr}`),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!token || !token?.isAvailable()) {
      throw new BackendException(
        cantCreateUser(user.email, `Token ${tokenId} is not available.`),
        HttpStatus.BAD_REQUEST,
      );
    }

    const [newUser, createUserErr] = await handlePromise(
      this.userService.createUser(user, token),
    );

    if (createUserErr) {
      throw new BackendException(
        `Cannot create user ${user.email}. Reason: ${createUserErr}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return newUser;
  }

  public async loginUser(email: string, password: string) {
    const [user, getUserErr] = await handlePromise(
      this.userService.findByEmail(email),
    );

    if (getUserErr) {
      throw new BackendException(
        `Cannot validate user: ${getUserErr}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!user) {
      throw new BackendException(
        `Credentials are invalid`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const [isValidPwd, pwdErr] = await handlePromise(
      this.userService.validatePassword(user, password),
    );

    if (pwdErr) {
      throw new BackendException(
        `Cannot validate user: ${pwdErr}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!isValidPwd) {
      throw new BackendException(
        `Credentials are invalid`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = this.buildAccessTokenPayload(user);

    return {
      accessToken: await this.accessTokenService.signAsync(payload),
    };
  }

  public async createRegisterToken(
    creatorId: Types.ObjectId,
    createdFor?: string,
  ): Promise<IdDto> {
    const [tokenId, err] = await handlePromise<IdDto, string>(
      this.registerTokenService.add(creatorId, createdFor),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return tokenId;
  }

  public async getRegisterToken(available?: boolean): Promise<RegisterToken[]> {
    const [tokens, err] = await handlePromise<RegisterToken[], string>(
      this.registerTokenService.getAll(available),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return tokens;
  }

  public async deleteRegisterToken(
    tokenId: Types.ObjectId,
    deletedBy: Types.ObjectId,
  ): Promise<void> {
    const [token, getErr] = await handlePromise<RegisterTokenDocument, string>(
      this.registerTokenService.get(tokenId),
    );

    if (getErr) {
      throw new BackendException(getErr, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!token) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    if (!token.isAvailable()) {
      throw new BackendException(
        cantDeleteToken(tokenId, `Token is not available.`),
        HttpStatus.BAD_REQUEST,
      );
    }

    const [, err] = await handlePromise<void, string>(
      this.registerTokenService.delete(tokenId, deletedBy),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private buildAccessTokenPayload(user: User): AccessTokenPayload {
    const { roles, name, lastName, email } = user;
    const { _id: id } = user as any as Document<Types.ObjectId, any, User>;

    return {
      id,
      roles,
      name,
      lastName,
      email,
    };
  }
}

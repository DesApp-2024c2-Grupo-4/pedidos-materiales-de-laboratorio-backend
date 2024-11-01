import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import handlePromise from '../../utils/promise';
import {
  cantCreateToken,
  cantDeleteToken,
  cantGetToken,
  cantGetTokenById,
} from './register-token.errors';
import { IS_SOFT_DELETED_KEY } from '../../schemas/common/soft-delete.schema';
import { RegisterToken } from '../../schemas/register-token.schema';

@Injectable()
export class RegisterTokenDbService {
  constructor(
    @InjectModel(RegisterToken.name)
    private RegisterTokenModel: Model<RegisterToken>,
  ) {}

  async add(
    creatorId: Types.ObjectId,
    createdFor?: string,
  ): Promise<Types.ObjectId> {
    const [token, createErr] = await handlePromise(
      this.RegisterTokenModel.create({
        creatorId,
        ...(createdFor && { createdFor }),
      }),
    );

    if (createErr) {
      return Promise.reject(cantCreateToken(createErr));
    }
    return token._id;
  }

  async getAll(available: boolean): Promise<RegisterToken[]> {
    const [tokens, err] = await handlePromise(
      this.RegisterTokenModel.find({ available }),
    );

    if (err) {
      return Promise.reject(cantGetToken(err));
    }

    return tokens;
  }

  async get(id: Types.ObjectId): Promise<RegisterToken> {
    const [token, err] = await handlePromise(
      this.RegisterTokenModel.findById(id),
    );

    if (err) {
      return Promise.reject(cantGetTokenById(id, err));
    }

    return token;
  }

  async delete(id: Types.ObjectId, deletedBy: Types.ObjectId): Promise<void> {
    const softDelete = {
      [IS_SOFT_DELETED_KEY]: true,
      deletedBy,
      deletionDate: new Date(Date.now()),
    };

    const [, err] = await handlePromise(
      this.RegisterTokenModel.updateOne({ _id: id }, { $set: softDelete }),
    );

    if (err) {
      return Promise.reject(cantDeleteToken(id, err));
    }
  }
}

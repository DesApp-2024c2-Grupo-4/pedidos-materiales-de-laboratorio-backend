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
import {
  RegisterToken,
  RegisterTokenDocument,
} from '../../schemas/register-token.schema';
import { IdDto } from '../../dto/id.dto';

@Injectable()
export class RegisterTokenDbService {
  constructor(
    @InjectModel(RegisterToken.name)
    private RegisterTokenModel: Model<RegisterToken>,
  ) {}

  async add(creatorId: Types.ObjectId, createdFor?: string): Promise<IdDto> {
    const [token, createErr] = await handlePromise(
      this.RegisterTokenModel.create({
        creatorId,
        ...(createdFor && { createdFor }),
      }),
    );

    if (createErr) {
      return Promise.reject(cantCreateToken(createErr));
    }
    return { id: token._id };
  }

  /**
   * Get all tokens from db
   * @param available will return all tokens if undefined either
   * they are available or not, if true will return only available
   * tokens, if false will return consumed tokens only.
   * @returns RegisterToken[]
   */
  async getAll(available: boolean): Promise<RegisterToken[]> {
    const query =
      available !== undefined
        ? { userCreated: { $exists: !available, $ne: '' } }
        : {};

    const [tokens, err] = await handlePromise(
      this.RegisterTokenModel.find(query),
    );

    if (err) {
      return Promise.reject(cantGetToken(err));
    }

    return tokens;
  }

  async get(id: Types.ObjectId): Promise<RegisterTokenDocument> {
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

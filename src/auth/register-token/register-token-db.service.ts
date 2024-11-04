import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
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

  /**
   * Adds a new register token to the database.
   *
   * @param {Types.ObjectId} creatorId - The ID of the user creating the token.
   * @param {string} [createdFor] - Optional identifier for whom the token is created.
   * @returns {Promise<IdDto>} - A promise that resolves to an object containing the token ID.
   * @throws {Error} - Throws an error if the token creation fails.
   */
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
   * Retrieves all register tokens based on their availability status.
   *
   * @param {boolean} available - Indicates whether to filter tokens by availability.
   * If `true`, the query will return tokens that are either:
   * - Not soft deleted (isSoftDeleted does not exist and is not empty)
   * - No user created with that token (userCreated does not exist or is empty)
   * If `false`, it will return tokens that are soft deleted or have been consumed.
   * If `undefined`, it returns all tokens.
   *
   * @returns {Promise<RegisterToken[]>} - A promise that resolves to an array of register tokens.
   * @throws {Error} - Throws an error if there is an issue retrieving the tokens.
   */
  async getAll(available?: boolean): Promise<RegisterToken[]> {
    const query = this.filterByAvailability(available);

    const [tokens, err] = await handlePromise(
      this.RegisterTokenModel.find(query),
    );

    if (err) {
      return Promise.reject(cantGetToken(err));
    }

    return tokens;
  }

  filterByAvailability(available?: boolean): FilterQuery<RegisterToken> {
    if (available === true)
      return {
        userCreated: { $exists: false },
        [IS_SOFT_DELETED_KEY]: { $exists: false },
      };

    if (available === false)
      return {
        $or: [
          { userCreated: { $exists: true, $ne: '' } },
          { isSoftDeleted: { $exists: true, $eq: true } },
        ],
      };

    return {};
  }

  /**
   * Retrieves a register token by its ID.
   *
   * @param {Types.ObjectId} id - The ID of the register token to retrieve.
   *
   * @returns {Promise<RegisterTokenDocument>} - A promise that resolves to the retrieved register token document.
   * @throws {Error} - Throws an error if there is an issue retrieving the token by ID.
   */
  async get(id: Types.ObjectId): Promise<RegisterTokenDocument> {
    const [token, err] = await handlePromise(
      this.RegisterTokenModel.findById(id),
    );

    if (err) {
      return Promise.reject(cantGetTokenById(id, err));
    }

    return token;
  }

  /**
   * Soft deletes a register token by marking it as deleted.
   *
   * @param {Types.ObjectId} id - The ID of the register token to be deleted.
   * @param {Types.ObjectId} deletedBy - The ID of the user performing the deletion.
   *
   * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
   * @throws {Error} - Throws an error if there is an issue during the deletion process.
   */
  async delete(
    tokenId: Types.ObjectId,
    deletedBy: Types.ObjectId,
  ): Promise<void> {
    const softDelete = {
      [IS_SOFT_DELETED_KEY]: true,
      deletedBy,
      deletionDate: new Date(Date.now()),
    };

    const filter = {
      _id: tokenId,
      ...this.filterByAvailability(true),
    };

    const [, err] = await handlePromise(
      this.RegisterTokenModel.updateOne(filter, { $set: softDelete }),
    );

    if (err) {
      return Promise.reject(cantDeleteToken(tokenId, err));
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import handlePromise from '../utils/promise';
import {
  Reactive,
  ReactiveDocument,
} from '../schemas/requestable/reactive.schema';
import {
  cantCreateReactive,
  cantGetRactives,
  cantUpdateReactive,
  cantDeleteReactive,
  cantGetReactive as cantGetReactiveById,
} from './reactive.errors';
import { UpdateReactivelDto } from '../dto/reactive.dto';
import {
  DELETED_BY_KEY,
  DELETION_DATE_KEY,
  IS_SOFT_DELETED_KEY,
} from '../schemas/common/soft-delete.schema';

@Injectable()
export class ReactiveDbService {
  constructor(
    @InjectModel(Reactive.name)
    private ReactiveModel: Model<Reactive>,
  ) {}

  async add(reactive: Reactive): Promise<Types.ObjectId> {
    const [e, createErr] = await handlePromise(
      this.ReactiveModel.create(reactive),
    );

    if (createErr) {
      return Promise.reject(cantCreateReactive(createErr));
    }

    return e._id;
  }

  async getAll(isAvailable?: boolean): Promise<Reactive[]> {
    const [reactives, err] = await handlePromise(this.ReactiveModel.find());

    if (err) {
      return Promise.reject(cantGetRactives(err));
    }

    if (isAvailable) {
      return reactives.filter((e) => !e[IS_SOFT_DELETED_KEY]);
    }

    if (isAvailable === false) {
      return reactives.filter((e) => e[IS_SOFT_DELETED_KEY]);
    }

    return reactives;
  }

  async get(id: Types.ObjectId): Promise<ReactiveDocument> {
    const [reactive, err] = await handlePromise(
      this.ReactiveModel.findById(id),
    );

    if (err) {
      return Promise.reject(cantGetReactiveById(id, err));
    }

    return reactive;
  }

  async update(
    id: Types.ObjectId,
    reactive: UpdateReactivelDto,
  ): Promise<void> {
    const [, err] = await handlePromise(
      this.ReactiveModel.updateOne({ _id: id }, reactive, { new: true }),
    );

    if (err) {
      return Promise.reject(cantUpdateReactive(id, err));
    }
  }

  async delete(
    reactive: ReactiveDocument,
    deletedBy: Types.ObjectId,
  ): Promise<void> {
    reactive[IS_SOFT_DELETED_KEY] = true;
    reactive[DELETED_BY_KEY] = deletedBy;
    reactive[DELETION_DATE_KEY] = new Date(Date.now());

    const [, err] = await handlePromise(reactive.save());

    if (err) {
      return Promise.reject(cantDeleteReactive(reactive._id, err));
    }
  }
}

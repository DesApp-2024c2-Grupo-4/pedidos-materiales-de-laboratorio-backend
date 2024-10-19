import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import handlePromise from '../utils/promise';
import { Reactive } from '../schemas/requestable/reactive.schema';
import {
  cantCreateReactive,
  cantSearchReactive,
  cantUpdateReactive,
  cantDeleteReactive,
  cantSearchReactiveById as cantGetReactiveById,
} from './reactive.errors';
import { UpdateReactivelDto } from 'src/dto/reactive.dto';

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
      throw new Error(cantCreateReactive(createErr));
    }

    return e._id;
  }

  async getAll(available: boolean): Promise<Reactive[]> {
    const [reactives, err] = await handlePromise(
      this.ReactiveModel.find({ available }),
    );

    if (err) {
      throw new Error(cantSearchReactive(err));
    }

    return reactives;
  }

  async get(id: Types.ObjectId): Promise<Reactive> {
    const [reactive, err] = await handlePromise(
      this.ReactiveModel.findById(id),
    );

    if (err) {
      throw new Error(cantGetReactiveById(id, err));
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
      throw new Error(cantUpdateReactive(id, err));
    }
  }

  async delete(id: Types.ObjectId): Promise<void> {
    const [, err] = await handlePromise(
      this.ReactiveModel.findByIdAndDelete(id),
    );

    if (err) {
      throw new Error(cantDeleteReactive(id, err));
    }
  }
}

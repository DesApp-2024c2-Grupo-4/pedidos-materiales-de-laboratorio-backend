import { HttpStatus, Injectable } from '@nestjs/common';
import { Reactive } from '../schemas/requestable/reactive.schema';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReactiveDbService } from './reactive-db.service';
import { UpdateReactivelDto } from '../dto/reactive.dto';

@Injectable()
export class ReactiveService {
  constructor(
    @InjectModel(Reactive.name)
    private readonly dbService: ReactiveDbService,
  ) {}

  async add(reactive: Reactive): Promise<void> {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.add(reactive),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(available: boolean = true): Promise<Reactive[]> {
    const [reactives, err] = await handlePromise<Reactive[], Error>(
      this.dbService.getAll(available),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!reactives) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    return reactives;
  }

  async get(id: Types.ObjectId): Promise<Reactive> {
    const [reactive, err] = await handlePromise<Reactive, Error>(
      this.dbService.get(id),
    );
    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!reactive) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    return reactive;
  }

  async update(
    id: Types.ObjectId,
    reactive: UpdateReactivelDto,
  ): Promise<void> {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.update(id, reactive),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: Types.ObjectId) {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.delete(id),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

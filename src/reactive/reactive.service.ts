import { HttpStatus, Injectable } from '@nestjs/common';
import {
  Reactive,
  ReactiveDocument,
} from '../schemas/requestable/reactive.schema';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Types } from 'mongoose';
import { ReactiveDbService } from './reactive-db.service';
import { UpdateReactivelDto } from './reactive.dto';
import { IS_SOFT_DELETED_KEY } from '../schemas/common/soft-delete.schema';

@Injectable()
export class ReactiveService {
  constructor(private readonly dbService: ReactiveDbService) {}

  async add(reactive: Reactive) {
    const [id, err] = await handlePromise<unknown, Error>(
      this.dbService.add(reactive),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { id };
  }

  async getAll(available?: boolean): Promise<Reactive[]> {
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

  async get(id: Types.ObjectId): Promise<ReactiveDocument> {
    const [reactive, err] = await handlePromise<ReactiveDocument, Error>(
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

  async delete(id: Types.ObjectId, deletedBy: Types.ObjectId) {
    const [reactive, getErr] = await handlePromise<ReactiveDocument, Error>(
      this.get(id),
    );

    if (getErr) {
      throw new BackendException(
        getErr.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (reactive[IS_SOFT_DELETED_KEY]) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.delete(reactive, deletedBy),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

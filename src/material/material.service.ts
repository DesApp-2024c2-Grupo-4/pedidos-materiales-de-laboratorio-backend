import { HttpStatus, Injectable } from '@nestjs/common';
import { MaterialDbService } from './material-db.service';
import handlePromise from 'src/utils/promise';
import { BackendException } from 'src/shared/backend.exception';
import { Material } from 'src/schemas/requestable/material.schema';
import { Types } from 'mongoose';

@Injectable()
export class MaterialService {
  constructor(private readonly dbService: MaterialDbService) {}

  async add(material: Material) {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.add(material),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: Types.ObjectId, material: Material) {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.update(id, material),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async get(id: Types.ObjectId) {
    const [material, err] = await handlePromise<unknown, Error>(
      this.dbService.get(id),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!material) {
      return new BackendException('', HttpStatus.NOT_FOUND);
    }

    return material;
  }

  async getAll() {
    const [material, err] = await handlePromise<unknown, Error>(
      this.dbService.getAll(),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return material;
  }

  async delete(id: Types.ObjectId) {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.delete(id),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

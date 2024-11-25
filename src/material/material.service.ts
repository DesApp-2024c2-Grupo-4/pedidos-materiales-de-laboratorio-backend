import { HttpStatus, Injectable } from '@nestjs/common';
import { MaterialDbService } from './material-db.service';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import {
  Material,
  MaterialDocument,
} from '../schemas/requestable/material.schema';
import { Types } from 'mongoose';
import { UpdateMaterialDto } from './material.dto';
import { IS_SOFT_DELETED_KEY } from '../schemas/common/soft-delete.schema';

@Injectable()
export class MaterialService {
  constructor(private readonly dbService: MaterialDbService) {}

  async add(material: Material) {
    const [id, err] = await handlePromise<Types.ObjectId, string>(
      this.dbService.add(material),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { id };
  }

  async update(id: Types.ObjectId, material: UpdateMaterialDto) {
    const [, err] = await handlePromise<unknown, string>(
      this.dbService.update(id, material),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async get(id: Types.ObjectId): Promise<MaterialDocument> {
    const [material, err] = await handlePromise<MaterialDocument, string>(
      this.dbService.get(id),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!material) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    return material;
  }

  async getAll(isAvailable?: boolean) {
    const [materials, err] = await handlePromise<unknown, string>(
      this.dbService.getAll(isAvailable),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return materials;
  }

  async delete(id: Types.ObjectId, deletedBy: Types.ObjectId) {
    const [material, getErr] = await handlePromise<MaterialDocument, string>(
      this.get(id),
    );

    if (getErr) {
      throw new BackendException(getErr, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (material[IS_SOFT_DELETED_KEY]) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    const [, err] = await handlePromise<unknown, string>(
      this.dbService.delete(material, deletedBy),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

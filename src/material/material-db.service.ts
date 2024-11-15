import { Injectable } from '@nestjs/common';
import {
  Material,
  MaterialDocument,
} from '../schemas/requestable/material.schema';
import { InjectModel } from '@nestjs/mongoose';
import handlePromise from '../utils/promise';
import {
  cantCreateMaterial,
  cantDelete,
  cantGet,
  cantGetMaterials,
  cantUpdate,
} from './material.error';
import { Model, Types } from 'mongoose';
import {
  DELETED_BY_KEY,
  DELETION_DATE_KEY,
  IS_SOFT_DELETED_KEY,
} from '../schemas/common/soft-delete.schema';
import { UpdateMaterialDto } from '../dto/material.dto';

@Injectable()
export class MaterialDbService {
  constructor(
    @InjectModel(Material.name)
    private materialModel: Model<Material>,
  ) {}

  async add(material: Material): Promise<Types.ObjectId> {
    const [newMaterial, err] = await handlePromise(
      this.materialModel.create(material),
    );

    if (err) {
      return Promise.reject(cantCreateMaterial(material.type, err));
    }

    return newMaterial._id;
  }

  async update(id: Types.ObjectId, material: UpdateMaterialDto) {
    const [, err] = await handlePromise(
      this.materialModel.updateOne({ _id: id }, material),
    );

    if (err) {
      return Promise.reject(cantUpdate(id, err));
    }
  }

  async get(id: Types.ObjectId) {
    const [material, err] = await handlePromise(
      this.materialModel.findOne({ _id: id }),
    );

    if (err) {
      return Promise.reject(cantGet(id, err));
    }

    return material;
  }

  async getAll(isAvailable?: boolean) {
    const [materials, err] = await handlePromise(this.materialModel.find());

    if (err) {
      return Promise.reject(cantGetMaterials(err));
    }

    if (isAvailable) {
      return materials.filter((e) => !e[IS_SOFT_DELETED_KEY]);
    }

    if (isAvailable === false) {
      return materials.filter((e) => e[IS_SOFT_DELETED_KEY]);
    }

    return materials;
  }

  async delete(
    material: MaterialDocument,
    deletedBy: Types.ObjectId,
  ): Promise<void> {
    material[IS_SOFT_DELETED_KEY] = true;
    material[DELETED_BY_KEY] = deletedBy;
    material[DELETION_DATE_KEY] = new Date(Date.now());

    const [, err] = await handlePromise(material.save());

    if (err) {
      return Promise.reject(cantDelete(material._id, err));
    }
  }
}

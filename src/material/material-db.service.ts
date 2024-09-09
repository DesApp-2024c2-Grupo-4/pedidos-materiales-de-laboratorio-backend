import { Injectable } from '@nestjs/common';
import {
  Material,
  UpdateMaterialDto,
} from '../schemas/requestable/material.schema';
import { InjectModel } from '@nestjs/mongoose';
import handlePromise from '../utils/promise';
import {
  cantCreateMaterial,
  cantdelete,
  cantGet,
  cantGetMaterials,
  cantupdate,
} from './material.error';
import { Model, Types } from 'mongoose';
import { IS_SOFT_DELETED_KEY } from '../schemas/common/soft-delete.schema';

@Injectable()
export class MaterialDbService {
  constructor(
    @InjectModel(Material.name)
    private materialModel: Model<Material>,
  ) {}

  async add(material: Material) {
    const [newMaterial, err] = await handlePromise(
      this.materialModel.create(material),
    );
    newMaterial.save();
    if (err) {
      return new Error(cantCreateMaterial(material.type, err));
    }
  }

  async update(id: Types.ObjectId, material: UpdateMaterialDto) {
    const [, err] = await handlePromise(
      this.materialModel.updateOne({ _id: id }, material),
    );

    if (err) {
      return new Error(cantupdate(id, err));
    }
  }

  async get(id: Types.ObjectId) {
    const [material, err] = await handlePromise(
      this.materialModel.findOne({ _id: id }),
    );

    if (err) {
      return new Error(cantGet(id, err));
    }

    return material;
  }

  async getAll() {
    const [materials, err] = await handlePromise(this.materialModel.find());

    if (err) {
      return new Error(cantGetMaterials(err));
    }

    return materials;
  }

  async delete(id: Types.ObjectId) {
    const softDelete = {};
    softDelete[IS_SOFT_DELETED_KEY] = true;

    const [, err] = await handlePromise(
      this.materialModel.updateOne({ _id: id }, { $set: softDelete }),
    );

    if (err) {
      return new Error(cantdelete(id, err));
    }
  }
}

import { Injectable } from '@nestjs/common';
import { Material } from '../schemas/requestable/material.schema';
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

@Injectable()
export class MaterialDbService {
  constructor(
    @InjectModel(Material.name)
    private materialModel: Model<Material>,
  ) {}

  async add(material: Material) {
    console.log({ material });
    const [newMaterial, err] = await handlePromise(
      this.materialModel.create(material),
    );
    newMaterial.save();
    if (err) {
      return new Error(cantCreateMaterial(material.type, err));
    }
  }

  async update(id: Types.ObjectId, material: Material) {
    const [, err] = await handlePromise(
      this.materialModel.updateOne({ id }, material),
    );

    if (err) {
      return new Error(cantupdate(id, err));
    }
  }

  async get(id: Types.ObjectId) {
    const [material, err] = await handlePromise(
      this.materialModel.findOne({ id }),
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
    const [, err] = await handlePromise(
      this.materialModel.updateOne({ id }, { softDeleted: true }),
    );

    if (err) {
      return new Error(cantdelete(id, err));
    }
  }
}

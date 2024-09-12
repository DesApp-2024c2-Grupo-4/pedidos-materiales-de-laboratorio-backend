import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import handlePromise from '../utils/promise';
import { Equipment } from '../schemas/requestable/equipment.schema';
import {
  cantCreateEquipment,
  cantGetEquipment,
  cantUpdateEquipment,
  cantDeleteEquipment,
  cantGetEquipmentById,
} from './equipment.errors';
import { IS_SOFT_DELETED_KEY } from 'src/schemas/common/soft-delete.schema';

@Injectable()
export class EquipmentdbService {
  constructor(
    @InjectModel(Equipment.name)
    private EquipmentModel: Model<Equipment>,
  ) {}

  async createEquipment(equipment: Equipment): Promise<Types.ObjectId> {
    const [e, createErr] = await handlePromise(
      this.EquipmentModel.create(equipment),
    );
    if (createErr) {
      throw new Error(cantCreateEquipment(createErr));
    }
    return e._id;
  }

  async getEquipments(available: boolean): Promise<Equipment[]> {
    const [equipments, err] = await handlePromise(
      this.EquipmentModel.find({ available: available }),
    );

    if (err) {
      throw new Error(cantGetEquipment(err));
    }
    return equipments;
  }

  async getEquipmentById(id: Types.ObjectId): Promise<Equipment> {
    const [equipment, err] = await handlePromise(
      this.EquipmentModel.findById(id),
    );

    if (err) {
      throw new Error(cantGetEquipmentById(id, err));
    }

    return equipment;
  }

  async updateEquipmentById(
    id: Types.ObjectId,
    equipment: Equipment,
  ): Promise<void> {
    const [, err] = await handlePromise(
      this.EquipmentModel.updateOne({ _id: id }, equipment, { new: true }),
    );
    if (err) {
      throw new Error(cantUpdateEquipment(id, err));
    }
  }

  async delete(id: Types.ObjectId) {
    const softDelete = {
      [IS_SOFT_DELETED_KEY]: true,
    };

    const [, err] = await handlePromise(
      this.EquipmentModel.updateOne({ _id: id }, { $set: softDelete }),
    );

    if (err) {
      return new Error(cantDeleteEquipment(id, err));
    }
  }
}

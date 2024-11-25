import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import handlePromise from '../utils/promise';
import {
  Equipment,
  EquipmentDocument,
} from '../schemas/requestable/equipment.schema';
import {
  cantCreateEquipment,
  cantGetEquipment,
  cantUpdateEquipment,
  cantDeleteEquipment,
  cantGetEquipmentById,
} from './equipment.errors';
import {
  DELETED_BY_KEY,
  DELETION_DATE_KEY,
  IS_SOFT_DELETED_KEY,
} from '../schemas/common/soft-delete.schema';
import { UpdateEquipmentDto } from './equipment.dto';

@Injectable()
export class EquipmentdbService {
  constructor(
    @InjectModel(Equipment.name)
    private EquipmentModel: Model<Equipment>,
  ) {}

  async add(equipment: Equipment): Promise<Types.ObjectId> {
    const [e, createErr] = await handlePromise(
      this.EquipmentModel.create(equipment),
    );
    if (createErr) {
      return Promise.reject(cantCreateEquipment(createErr));
    }
    return e._id;
  }

  async getAll(isAvailable?: boolean): Promise<EquipmentDocument[]> {
    const [equipments, err] = await handlePromise(this.EquipmentModel.find());

    if (err) {
      return Promise.reject(cantGetEquipment(err));
    }

    if (isAvailable) {
      return equipments.filter((e) => !e[IS_SOFT_DELETED_KEY]);
    }

    if (isAvailable === false) {
      return equipments.filter((e) => e[IS_SOFT_DELETED_KEY]);
    }

    return equipments;
  }

  async get(id: Types.ObjectId): Promise<EquipmentDocument> {
    const [equipment, err] = await handlePromise(
      this.EquipmentModel.findById(id),
    );

    if (err) {
      return Promise.reject(cantGetEquipmentById(id, err));
    }

    return equipment;
  }

  async update(
    id: Types.ObjectId,
    equipment: UpdateEquipmentDto,
  ): Promise<void> {
    const [, err] = await handlePromise(
      this.EquipmentModel.updateOne({ _id: id }, equipment),
    );
    if (err) {
      return Promise.reject(cantUpdateEquipment(id, err));
    }
  }

  async delete(
    equipment: EquipmentDocument,
    deletedBy: Types.ObjectId,
  ): Promise<void> {
    equipment[IS_SOFT_DELETED_KEY] = true;
    equipment[DELETED_BY_KEY] = deletedBy;
    equipment[DELETION_DATE_KEY] = new Date(Date.now());

    const [, err] = await handlePromise(equipment.save());

    if (err) {
      return Promise.reject(cantDeleteEquipment(equipment._id, err));
    }
  }
}

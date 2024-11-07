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
import { IS_SOFT_DELETED_KEY } from '../schemas/common/soft-delete.schema';
import { UpdateEquipmentDto } from '../dto/equipment.dto';

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
      throw new Error(cantCreateEquipment(createErr));
    }
    return e._id;
  }

  async getAll(isAvailable?: boolean): Promise<Equipment[]> {
    const [equipments, err] = await handlePromise(this.EquipmentModel.find());

    if (err) {
      throw new Error(cantGetEquipment(err));
    }

    if (isAvailable) {
      return equipments.filter((e) => !e[IS_SOFT_DELETED_KEY]);
    }

    if(isAvailable === false){
      return equipments.filter((e) => e[IS_SOFT_DELETED_KEY]);
    }

    return equipments;
  }

  async get(id: Types.ObjectId): Promise<Equipment> {
    const [equipment, err] = await handlePromise(
      this.EquipmentModel.findById(id),
    );

    if (err) {
      throw new Error(cantGetEquipmentById(id, err));
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
      throw new Error(cantUpdateEquipment(id, err));
    }
  }

  async delete(id: Types.ObjectId, deletedBy: Types.ObjectId): Promise<void> {
    const softDelete = {
      [IS_SOFT_DELETED_KEY]: true,
      deletedBy,
      deletionDate: new Date(Date.now()),
    };

    const [, err] = await handlePromise(
      this.EquipmentModel.updateOne({ _id: id }, { $set: softDelete }),
    );

    if (err) {
      throw new Error(cantDeleteEquipment(id, err));
    }
  }
}

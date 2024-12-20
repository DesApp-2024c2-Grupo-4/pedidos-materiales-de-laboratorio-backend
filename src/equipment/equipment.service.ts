import { HttpStatus, Injectable } from '@nestjs/common';
import {
  Equipment,
  EquipmentDocument,
} from '../schemas/requestable/equipment.schema';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Types } from 'mongoose';
import { EquipmentdbService } from './equipment-db.service';
import { UpdateEquipmentDto } from './equipment.dto';
import { IS_SOFT_DELETED_KEY } from '../schemas/common/soft-delete.schema';

@Injectable()
export class EquipmentService {
  constructor(private readonly dbEquipment: EquipmentdbService) {}

  async add(equipment: Equipment) {
    const [id, err] = await handlePromise(this.dbEquipment.add(equipment));

    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { id };
  }

  async getAll(isAvailable?: boolean): Promise<Equipment[]> {
    const [equipments, err] = await handlePromise(
      this.dbEquipment.getAll(isAvailable),
    );

    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!equipments) {
      return [];
    }

    return equipments;
  }

  async get(id: Types.ObjectId): Promise<EquipmentDocument> {
    const [equipment, err] = await handlePromise(this.dbEquipment.get(id));

    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!equipment) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    return equipment;
  }

  async update(id: Types.ObjectId, equipment: UpdateEquipmentDto) {
    const [, err] = await handlePromise(this.dbEquipment.update(id, equipment));

    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: Types.ObjectId, deletedBy: Types.ObjectId) {
    const [equipment, getErr] = await handlePromise<EquipmentDocument, Error>(
      this.dbEquipment.get(id),
    );

    if (getErr) {
      throw new BackendException(
        getErr.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (equipment[IS_SOFT_DELETED_KEY]) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    const [, err] = await handlePromise(
      this.dbEquipment.delete(equipment, deletedBy),
    );

    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

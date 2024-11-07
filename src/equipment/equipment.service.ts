import { HttpStatus, Injectable } from '@nestjs/common';
import { Equipment } from '../schemas/requestable/equipment.schema';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Types } from 'mongoose';
import { EquipmentdbService } from './equipment-db.service';
import { UpdateEquipmentDto } from '../dto/equipment.dto';

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

    return {id};
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

  async get(id: Types.ObjectId): Promise<Equipment> {
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
    const [, err] = await handlePromise(this.dbEquipment.delete(id, deletedBy));

    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

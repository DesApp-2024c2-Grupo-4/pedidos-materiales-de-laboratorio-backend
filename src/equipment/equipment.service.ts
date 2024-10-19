import { HttpStatus, Injectable } from '@nestjs/common';
import { Equipment } from '../schemas/requestable/equipment.schema';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EquipmentdbService } from './equipment-db.service';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name)
    private readonly dbEquipment: EquipmentdbService,
  ) {}

  async createEquipment(equipment: Equipment): Promise<Types.ObjectId> {
    const [id, err] = await handlePromise(
      this.dbEquipment.createEquipment(equipment),
    );

    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return id;
  }

  async getEquipments(available: boolean = true): Promise<Equipment[]> {
    const [equipments, err] = await handlePromise(
      this.dbEquipment.getEquipments(available),
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

  async getEquipmentById(id: Types.ObjectId): Promise<Equipment> {
    const [equipment, err] = await handlePromise(
      this.dbEquipment.getEquipmentById(id),
    );

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

  async updateEquipmentById(id: Types.ObjectId, equipment: Equipment) {
    const [, err] = await handlePromise(
      this.dbEquipment.updateEquipmentById(id, equipment),
    );

    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteEquipmentById(id: Types.ObjectId) {
    const [, err] = await handlePromise(this.dbEquipment.delete(id));

    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

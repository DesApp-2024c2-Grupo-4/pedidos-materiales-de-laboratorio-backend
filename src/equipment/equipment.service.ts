import { HttpStatus, Injectable } from '@nestjs/common';
import { Equipment } from '../schemas/requestable/equipment';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Model, Types } from 'mongoose';
import { EquipmentController } from './equipment.controller';
import { EquipmentModule } from './equipment.module';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class EquipmentService {
  constructor( 
    @InjectModel(Equipment.name)
    private EquipmentModel: Model<Equipment>
  ) { }

  async createEquipment(equipment: Equipment): Promise<Equipment> {
    return this.EquipmentModel.create(equipment);
  }

  async getEquipment(description: string): Promise<Equipment[]> {
    const [equipments, err] = await handlePromise(
      this.EquipmentModel.find({
        $and: [
          { description: { $regex: description, $options: "i" } },
          { available: true }
        ],
      }).sort({ type: 'asc', description: 'asc' })
    );

    if (err) {
      throw new BackendException(
        `Cannot get equipment ${description}. Reason: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return equipments;
  }

  async getEquipments(): Promise<Equipment[]> {
    const [equipments, err] = await handlePromise(
      this.EquipmentModel.find(
        { available: true })
    );

    if (err) {
      throw new BackendException(
        `Cannot get equipments Reason: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return equipments;
  }

  async getEquipmentById(id: Types.ObjectId): Promise<Equipment> {
    const [equipment, err] = await handlePromise(
      this.EquipmentModel.findById(id)
    );
    if (err) {
      throw new BackendException(
        `Cannot get equipment ${id}. Reason: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return equipment;
  }



  async updateEquipmentById(id: Types.ObjectId, equipment: Equipment): Promise<Equipment> {
    const [result, err] = await handlePromise(
      this.EquipmentModel.updateOne({ _id: id }, equipment, { new: true })
    );
    if (err) {
      throw new BackendException(
        `Cannot get equipment ${id}. Reason: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return equipment; // TODO: Check how return the updated equipment with the last changes
  }



  async deleteEquipmentById(id: Types.ObjectId): Promise<String> {
    const [equipment, err] = await handlePromise(
      this.EquipmentModel.findByIdAndDelete(id)
    );
    if (err) {
      throw new BackendException(
        `Cannot get equipment ${id}. Reason: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      
    }
    return `Equipment with description ${equipment.description} and id ${equipment.id} was deleted successfully`;
  }


}
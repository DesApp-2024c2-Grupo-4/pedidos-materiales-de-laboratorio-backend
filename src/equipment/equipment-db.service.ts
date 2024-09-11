import {  Injectable } from '@nestjs/common';
import {  InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import handlePromise from '../utils/promise';
import { Equipment } from '../schemas/requestable/equipment';
import { BackendException } from '../shared/backend.exception';
import { cantCreateEquipment , cantSearchEquipment ,cantUpdateEquipment , cantDeleteEquipment, cantSearchEquipmentById as cantGetEquipmentById , } from './equipment.errors' 

@Injectable()
export class EquipmentdbService {
  constructor( 
    @InjectModel(Equipment.name)
    private EquipmentModel: Model<Equipment>
  ) { }

  async createEquipment(equipment: Equipment): Promise<Types.ObjectId> {
    const [e, createErr] = await handlePromise(
     this.EquipmentModel.create(equipment),
    );
    if (createErr)
    {
            throw new Error(cantCreateEquipment(createErr))
    }
    return e._id
  }

  async searchEquipment(description: string): Promise<Equipment[]> {
    const [equipments, searchErr] = await handlePromise(this.EquipmentModel.find({
        $and: [
          { description: { $regex: description, $options: "i" } },
          { available: true }
        ],
      }).sort({ type: 'asc', description: 'asc' }))

      if(searchErr){
        throw new Error(cantSearchEquipment(searchErr))
      }
      return equipments
  }

  async getEquipments(available:boolean): Promise<Equipment[]> {
    const [equipments, err] = await handlePromise(
      this.EquipmentModel.find(
        { available: available })
    );

    if (err) {
       throw new Error(cantSearchEquipment(err))
    }
    return equipments;
  }

  async getEquipmentById(id: Types.ObjectId): Promise<Equipment> {

    const [equipment, err] = await handlePromise(
      this.EquipmentModel.findById(id)
    );

    if (err) {
          throw new Error(cantGetEquipmentById(id, err))
        }
    return equipment;
  }

  async updateEquipmentById(id: Types.ObjectId, equipment: Equipment): Promise<Equipment> {
    const [result, err] = await handlePromise(
      this.EquipmentModel.updateOne({ _id: id }, equipment, { new: true })
    );
    if (err) {
          throw new Error(cantUpdateEquipment(id,err));
    }
    return equipment; // TODO: Check how return the updated equipment with the last changes
  }

  async deleteEquipmentById(id: Types.ObjectId): Promise<String> {
    const [equipment, err] = await handlePromise(
      this.EquipmentModel.findByIdAndDelete(id)
    );
    if (err) {
        throw new Error(cantDeleteEquipment(id,err));      
    }
    return `Equipment with description ${equipment.description} and id ${equipment.id} was deleted successfully`;
  }


}
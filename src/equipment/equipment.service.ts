import { HttpStatus, Injectable } from '@nestjs/common';
import { Equipment } from '../schemas/requestable/equipment';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Model, Types } from 'mongoose';
import { EquipmentController } from './equipment.controller';
import { EquipmentModule } from './equipment.module';
import { InjectModel } from '@nestjs/mongoose';
import { EquipmentdbService } from './equipment-db.service'


@Injectable()
export class EquipmentService {
  constructor( 
    @InjectModel(Equipment.name)
    private EquipmentModel: Model<Equipment>,
    private readonly dbEquipment: EquipmentdbService,

  ) { }

  async createEquipment(equipment: Equipment) {
    const [newequipment , err ] = await   handlePromise(this.dbEquipment.createEquipment(equipment))

    if (err) {
        throw new BackendException( (err as Error).message, HttpStatus.INTERNAL_SERVER_ERROR,);
      }

    return HttpStatus.CREATED
  }


  async getEquipments(available:boolean = true): Promise<Equipment[]> {
    const [equipments, err] = await handlePromise(
      this.dbEquipment.getEquipments(available)
    );

    if (err) {
     throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if(!equipments)
    {
        throw new BackendException(
        (err as Error).message,
        HttpStatus.NOT_FOUND,
      );
    }
    return equipments;
  }

  async getEquipmentById(id: Types.ObjectId): Promise<Equipment> {
    const [equipment, err] = await handlePromise(
      this.dbEquipment.getEquipmentById(id)
    );
    
    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return equipment;
  }



  async updateEquipmentById(id: Types.ObjectId, equipment: Equipment) {
    const [result, err] = await handlePromise(
     this.dbEquipment.updateEquipmentById(id,equipment)
    );
    if (err) {
      throw new BackendException(
            (err as Error).message,
             HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if(!result)
    {
        throw new BackendException(
        (err as Error).message,
        HttpStatus.NOT_FOUND,
      );
    }
    return HttpStatus.OK
  }



  async deleteEquipmentById(id: Types.ObjectId){
    const [equipment, err] = await handlePromise(
      this.dbEquipment.deleteEquipmentById(id)
    );
    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );      
    }
    return HttpStatus.OK
  }
}
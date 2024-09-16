import { Injectable }   from '@nestjs/common';
import { InjectModel }  from '@nestjs/mongoose';
import handlePromise    from '../utils/promise';
import { Model, Types } from 'mongoose';
import { InUse }        from 'src/schemas/common/in-use.schema';
import { Equipment }    from 'src/schemas/requestable/equipment.schema';
import { Reactive }     from 'src/schemas/requestable/reactive.schema';
import { Material }     from 'src/schemas/requestable/material.schema';
import { cantAffectMaterials , cantAffectEquipments  , cantAffectReactives} from './shared.error'

@Injectable()
export class SharedDbService {
  constructor(
    @InjectModel(Material.name)
    private materialModel: Model<Material>,
    @InjectModel(Request.name)
    private requestModel: Model<Request>,
    @InjectModel(Equipment.name)
    private equipmentModel: Model<Equipment>,
    @InjectModel(Reactive.name)
    private reactiveModel: Model<Reactive>,
  ) {}

  async updateMaterial(ids: Types.ObjectId[] , inUse: InUse) {
    const [, err] = await handlePromise(
      this.materialModel.updateMany({ _id: {$in: ids} }, 
                                    { $push: {InUse} }
                                 ),
    );

    if (err) {
      return new Error(cantAffectMaterials( err));
    }
  }

  async updateEquipment(ids: Types.ObjectId[] , inUse: InUse) {
    const [, err] = await handlePromise(
      this.equipmentModel.updateMany({ _id: {$in: ids} }, 
                                    { $push: {InUse} }
                                 ),
    );

    if (err) {
      return new Error(cantAffectEquipments( err));
    }
  }

  async updateReactive(ids: Types.ObjectId[] , inUse: InUse) {
    const [, err] = await handlePromise(
      this.reactiveModel.updateMany({ _id: {$in: ids} }, 
                                    { $push: {InUse} }
                                 ),
    );

    if (err) {
      return new Error(cantAffectReactives( err));
    }
  }
}

import {  Injectable } from '@nestjs/common';
import {  InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import handlePromise from '../utils/promise';
import { Reactive } from '../schemas/requestable/reactive';
import { BackendException } from '../shared/backend.exception';
import { cantCreateReactive , cantSearchReactive ,cantUpdateReactive , cantDeleteReactive, cantSearchReactiveById as cantGetReactiveById , } from './reactive.errors' 

@Injectable()
export class ReactivedbService {
  constructor( 
    @InjectModel(Reactive.name)
    private ReactiveModel: Model<Reactive>
  ) { }

  async createReactive(reactive: Reactive): Promise<Types.ObjectId> {
    const [e, createErr] = await handlePromise(
     this.ReactiveModel.create(reactive),
    );
    if (createErr)
    {
            throw new Error(cantCreateReactive(createErr))
    }
    return e._id
  }

  async searchReactive(description: string): Promise<Reactive[]> {
    const [reactives, searchErr] = await handlePromise(this.ReactiveModel.find({
        $and: [
          { description: { $regex: description, $options: "i" } },
          { available: true }
        ],
      }).sort({ type: 'asc', description: 'asc' }))

      if(searchErr){
        throw new Error(cantSearchReactive(searchErr))
      }
      return reactives
  }

  async getReactives(available:boolean): Promise<Reactive[]> {
    const [reactives, err] = await handlePromise(
      this.ReactiveModel.find(
        { available: available })
    );

    if (err) {
       throw new Error(cantSearchReactive(err))
    }
    return reactives;
  }

  async getReactiveById(id: Types.ObjectId): Promise<Reactive> {

    const [reactive, err] = await handlePromise(
      this.ReactiveModel.findById(id)
    );

    if (err) {
          throw new Error(cantGetReactiveById(id, err))
        }
    return reactive;
  }

  async updateReactiveById(id: Types.ObjectId, reactive: Reactive): Promise<Reactive> {
    const [result, err] = await handlePromise(
      this.ReactiveModel.updateOne({ _id: id }, reactive, { new: true })
    );
    if (err) {
          throw new Error(cantUpdateReactive(id,err));
    }
    return reactive; // TODO: Check how return the updated reactive with the last changes
  }

  async deleteReactiveById(id: Types.ObjectId): Promise<String> {
    const [reactive, err] = await handlePromise(
      this.ReactiveModel.findByIdAndDelete(id)
    );
    if (err) {
        throw new Error(cantDeleteReactive(id,err));      
    }
    return `Reactive with description ${reactive.description} and id ${reactive.id} was deleted successfully`;
  }


}
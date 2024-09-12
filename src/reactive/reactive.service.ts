import { HttpStatus, Injectable } from '@nestjs/common';
import { Reactive } from '../schemas/requestable/reactive';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Model, Types } from 'mongoose';
import { ReactiveController } from './reactive.controller';
import { ReactiveModule } from './reactive.module';
import { InjectModel } from '@nestjs/mongoose';
import { ReactivedbService } from './reactive-db.service'


@Injectable()
export class ReactiveService {
  constructor( 
    @InjectModel(Reactive.name)
    private ReactiveModel: Model<Reactive>,
    private readonly dbReactive: ReactivedbService,

  ) { }

  async createReactive(reactive: Reactive): Promise<HttpStatus> {
    const [newreactive , err ] = await   handlePromise(this.dbReactive.createReactive(reactive))

    if (err) {
        throw new BackendException( (err as Error).message, HttpStatus.INTERNAL_SERVER_ERROR,);
      }

    return  HttpStatus.CREATED
  }

 
  async getReactives(available:boolean = true): Promise<Reactive[]> {
    const [reactives, err] = await handlePromise(
      this.dbReactive.getReactives(available)
    );

    if (err) {
     throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!reactives) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.NOT_FOUND,
      );
    }

    return reactives;
  }

  async getReactiveById(id: Types.ObjectId): Promise<Reactive> {
    const [reactive, err] = await handlePromise(
      this.dbReactive.getReactiveById(id)
    );
    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!reactive) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.NOT_FOUND,
      );
    }

    return reactive;
  }



  async updateReactiveById(id: Types.ObjectId, reactive: Reactive): Promise<Reactive> {
    const [result, err] = await handlePromise(
     this.dbReactive.updateReactiveById(id,reactive)
    );
    if (err) {
      throw new BackendException(
            (err as Error).message,
             HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return reactive; 
  }



  async deleteReactiveById(id: Types.ObjectId) {
    const [reactive, err] = await handlePromise(
      this.dbReactive.deleteReactiveById(id)
    );
    if (err) {
      throw new BackendException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );      
    }
  }

}
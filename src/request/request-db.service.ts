import { Injectable } from '@nestjs/common';
import { Request } from '../schemas/request.schema';
import { InjectModel } from '@nestjs/mongoose';
import handlePromise from '../utils/promise';
import {
  cantCreateRequest,
  cantDelete,
  cantGet,
  cantGetRequests,
  cantUpdate,
} from './request.error';
import { Model, Types } from 'mongoose';
import { IS_SOFT_DELETED_KEY } from '../schemas/common/soft-delete.schema';
import { UpdateRequestDto } from '../dto/request.dto';

@Injectable()
export class RequestDbService {
  constructor(
    @InjectModel(Request.name)
    private requestModel: Model<Request>,
  ) {}

  async add(request: Request) {
    const [newRequest, err] = await handlePromise(
      this.requestModel.create(request),
    );
    newRequest.save();
    if (err) {
      return Promise.reject(cantCreateRequest(err));
    }
  }

  async update(id: Types.ObjectId, request: UpdateRequestDto) {
    const [, err] = await handlePromise(
      this.requestModel.updateOne({ _id: id }, request),
    );

    if (err) {
      return Promise.reject(cantUpdate(id, err));
    }
  }

  async get(id: Types.ObjectId) {
    const [request, err] = await handlePromise(
      this.requestModel.findOne({ _id: id }),
    );

    if (err) {
      return Promise.reject(cantGet(id, err));
    }

    return request;
  }

  async getAll() {
    const [requests, err] = await handlePromise(this.requestModel.find());

    if (err) {
      return Promise.reject(cantGetRequests(err));
    }

    return requests;
  }

  async delete(id: Types.ObjectId) {
    const softDelete = {};
    softDelete[IS_SOFT_DELETED_KEY] = true;

    const [, err] = await handlePromise(
      this.requestModel.updateOne({ _id: id }, { $set: softDelete }),
    );

    if (err) {
      return Promise.reject(cantDelete(id, err));
    }
  }
}

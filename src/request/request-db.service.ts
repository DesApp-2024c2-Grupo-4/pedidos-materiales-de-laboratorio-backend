import { Injectable } from '@nestjs/common';
import { Request, RequestDocument } from '../schemas/request.schema';
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
import {
  DELETED_BY_KEY,
  DELETION_DATE_KEY,
  IS_SOFT_DELETED_KEY,
} from '../schemas/common/soft-delete.schema';
import { CreateRequestDto, UpdateRequestDto } from '../dto/request.dto';
import { RequestStatusesValue } from './request.const';

@Injectable()
export class RequestDbService {
  constructor(
    @InjectModel(Request.name)
    private requestModel: Model<Request>,
  ) {}

  async add(
    creatorUserId: Types.ObjectId,
    createRequestDto: CreateRequestDto,
  ): Promise<Types.ObjectId> {
    const [newRequest, err] = await handlePromise(
      this.requestModel.create({
        ...createRequestDto,
        requestantUser: creatorUserId,
      }),
    );

    if (err) {
      return Promise.reject(cantCreateRequest(err));
    }

    return newRequest._id;
  }

  async update(id: Types.ObjectId, updateRequestDto: UpdateRequestDto) {
    const [, err] = await handlePromise(
      this.requestModel.updateOne({ _id: id }, updateRequestDto),
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

  async getAll(status?: RequestStatusesValue) {
    const filters = status ? { status } : {};

    const [requests, err] = await handlePromise(
      this.requestModel.find(filters),
    );

    if (err) {
      return Promise.reject(cantGetRequests(err));
    }

    return requests;
  }

  async delete(req: RequestDocument, deletedBy: Types.ObjectId): Promise<void> {
    req[IS_SOFT_DELETED_KEY] = true;
    req[DELETED_BY_KEY] = deletedBy;
    req[DELETION_DATE_KEY] = new Date(Date.now());

    const [, err] = await handlePromise(req.save());

    if (err) {
      return Promise.reject(cantDelete(req._id, err));
    }
  }
}

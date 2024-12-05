import { Injectable } from '@nestjs/common';
import { Request, RequestDocument } from '../schemas/request.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import handlePromise from '../utils/promise';
import {
  cantCreateRequest,
  cantDelete,
  cantGet,
  cantGetRequests,
  cantUpdate,
} from './request.error';
import { Connection, Model, Types } from 'mongoose';
import {
  DELETED_BY_KEY,
  DELETION_DATE_KEY,
  IS_SOFT_DELETED_KEY,
} from '../schemas/common/soft-delete.schema';
import { CreateRequestDto, UpdateRequestDto } from './request.dto';
import { RequestStatusesValue } from './request.const';
import { Conversation } from '../schemas/conversation.schema';

@Injectable()
export class RequestDbService {
  constructor(
    @InjectModel(Request.name)
    private requestModel: Model<Request>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async add(
    creatorUserId: Types.ObjectId,
    createRequestDto: CreateRequestDto,
  ): Promise<Types.ObjectId> {
    const [session, sessionError] = await handlePromise(
      this.connection.startSession(),
    );

    if (sessionError) {
      return Promise.reject(
        cantCreateRequest(`Error starting session: ${sessionError}`),
      );
    }

    session.startTransaction();

    const [[conversation], conversationErr] = await handlePromise(
      this.conversationModel.create([{}], { session }),
    );

    if (conversationErr) {
      await handlePromise(session.abortTransaction());
      await handlePromise(session.endSession());
      return Promise.reject(cantCreateRequest(conversationErr));
    }

    const { _id: conversationId } = conversation;

    const [newRequest, err] = await handlePromise(
      this.requestModel.create({
        ...createRequestDto,
        requestantUser: creatorUserId,
        conversation: conversationId,
      }),
    );

    if (err) {
      await handlePromise(session.abortTransaction());
      await handlePromise(session.endSession());
      return Promise.reject(cantCreateRequest(err));
    }

    const [, commitError] = await handlePromise(session.commitTransaction());

    if (commitError) {
      await handlePromise(session.abortTransaction());
      session.endSession();
      return Promise.reject(
        cantCreateRequest(`Error committing transaction: ${commitError}`),
      );
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

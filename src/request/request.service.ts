import { HttpStatus, Injectable } from '@nestjs/common';
import { RequestDbService } from './request-db.service';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import {  Request} from '../schemas/request.schema';
import {  UpdateRequestDto } from '../dto/request.dto';
import { Types } from 'mongoose';

@Injectable()
export class RequestService {
  constructor(private readonly dbService: RequestDbService) {}

  async add(request: Request) {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.add(request),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: Types.ObjectId, request: UpdateRequestDto) {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.update(id, request),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async get(id: Types.ObjectId) {
    const [request, err] = await handlePromise<unknown, Error>(
      this.dbService.get(id),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!request) {
      return new BackendException('', HttpStatus.NOT_FOUND);
    }

    return request;
  }

  async getAll() {
    const [requests, err] = await handlePromise<unknown, Error>(
      this.dbService.getAll(),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return requests;
  }

  async delete(id: Types.ObjectId) {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.delete(id),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

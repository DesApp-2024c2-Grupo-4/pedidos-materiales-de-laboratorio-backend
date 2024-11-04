import { HttpStatus, Injectable } from '@nestjs/common';
import { RequestDbService } from './request-db.service';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Request, RequestDocument } from '../schemas/request.schema';
import { UpdateRequestDto } from '../dto/request.dto';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestService {
  daysToExpireInSeconds: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly dbService: RequestDbService,
  ) {
    const daysToExpire = parseInt(
      this.configService.get<string>('REQUEST_TTL_IN_DAYS'),
      10,
    );
    this.daysToExpireInSeconds = daysToExpire * 86400;
  }

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
    const [request, err] = await handlePromise<RequestDocument, Error>(
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

    request.updateExpiration(this.daysToExpireInSeconds);

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

  async delete(id: Types.ObjectId, deletedBy: Types.ObjectId) {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.delete(id, deletedBy),
    );

    if (err) {
      return new BackendException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

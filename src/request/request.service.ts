import { HttpStatus, Injectable } from '@nestjs/common';
import { RequestDbService } from './request-db.service';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Request, RequestDocument } from '../schemas/request.schema';
import { UpdateRequestDto } from '../dto/request.dto';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { IS_SOFT_DELETED_KEY } from '../schemas/common/soft-delete.schema';

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
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: Types.ObjectId, request: UpdateRequestDto) {
    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.update(id, request),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async get(id: Types.ObjectId): Promise<RequestDocument> {
    const [request, err] = await handlePromise<RequestDocument, Error>(
      this.dbService.get(id),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!request) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    request.updateExpiration(this.daysToExpireInSeconds);

    return request;
  }

  async getAll() {
    const [requests, err] = await handlePromise<unknown, Error>(
      this.dbService.getAll(),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return requests;
  }

  async delete(id: Types.ObjectId, deletedBy: Types.ObjectId) {
    const [req, getErr] = await handlePromise<RequestDocument, Error>(
      this.get(id),
    );

    if (getErr) {
      throw new BackendException(
        getErr.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (req[IS_SOFT_DELETED_KEY]) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    const [, err] = await handlePromise<unknown, Error>(
      this.dbService.delete(req, deletedBy),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { RequestDbService } from './request-db.service';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { Request, RequestDocument } from '../schemas/request.schema';
import { CreateRequestDto, UpdateRequestDto } from './request.dto';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { IS_SOFT_DELETED_KEY } from '../schemas/common/soft-delete.schema';
import { EquipmentdbService } from '../equipment/equipment-db.service';
import { ReactiveDbService } from '../reactive/reactive-db.service';
import { MaterialDbService } from '../material/material-db.service';
import { checkItemsAvailability } from './request.helpers';
import { RequestStatusesValue } from './request.const';

@Injectable()
export class RequestService {
  daysToExpireInSeconds: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly dbService: RequestDbService,
    private readonly equipmentDbService: EquipmentdbService,
    private readonly reactiveDbService: ReactiveDbService,
    private readonly materialDbService: MaterialDbService,
  ) {
    const daysToExpire = parseInt(
      this.configService.get<string>('REQUEST_TTL_IN_DAYS'),
      10,
    );
    this.daysToExpireInSeconds = daysToExpire * 86400;
  }

  async add(creatorUserId: Types.ObjectId, createRequestDto: CreateRequestDto) {
    const [, validationError] = await handlePromise<unknown, Error>(
      this.isValidRequest(createRequestDto),
    );

    if (validationError) {
      throw validationError;
    }

    const [id, err] = await handlePromise<unknown, string>(
      this.dbService.add(creatorUserId, createRequestDto),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { id };
  }

  async update(id: Types.ObjectId, updateRequestDto: UpdateRequestDto) {
    const [, validationError] = await handlePromise<unknown, Error>(
      this.isValidRequest(updateRequestDto),
    );

    if (validationError) {
      throw validationError;
    }

    const [, err] = await handlePromise<unknown, string>(
      this.dbService.update(id, updateRequestDto),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async get(id: Types.ObjectId): Promise<RequestDocument> {
    const [request, err] = await handlePromise<RequestDocument, string>(
      this.dbService.get(id),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!request) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    request.updateExpiration(this.daysToExpireInSeconds);

    return request;
  }

  async getAll(status?: RequestStatusesValue) {
    const [requests, err] = await handlePromise<unknown, string>(
      this.dbService.getAll(status),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return requests;
  }

  async delete(id: Types.ObjectId, deletedBy: Types.ObjectId) {
    const [req, getErr] = await handlePromise<RequestDocument, string>(
      this.get(id),
    );

    if (getErr) {
      throw new BackendException(getErr, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (req[IS_SOFT_DELETED_KEY]) {
      throw new BackendException('', HttpStatus.NOT_FOUND);
    }

    const [, err] = await handlePromise<unknown, string>(
      this.dbService.delete(req, deletedBy),
    );

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async isValidRequest(request: Partial<Request>) {
    const equipmentAmount = request.equipments?.length;
    const materialAmount = request.materials?.length;
    const reactiveAmount = request.reactives?.length;

    if (!equipmentAmount && !materialAmount && !reactiveAmount) {
      throw new BackendException(
        'Request cannot be empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [itemsAvailaiblity, availabilityErr] = await handlePromise(
      checkItemsAvailability(
        request,
        this.equipmentDbService,
        this.reactiveDbService,
        this.materialDbService,
      ),
    );

    if (availabilityErr) {
      throw availabilityErr;
    }

    if (!itemsAvailaiblity.available) {
      throw new BackendException(itemsAvailaiblity.err, HttpStatus.BAD_REQUEST);
    }
  }
}

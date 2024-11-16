import { HttpStatus, Injectable } from '@nestjs/common';
import { RequestDbService } from './request-db.service';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import {
  EquipmentRequest,
  HasEnoughStockAvailable,
  MaterialRequest,
  ReactiveRequest,
  Request,
  RequestableElement,
  RequestDocument,
} from '../schemas/request.schema';
import { UpdateRequestDto } from '../dto/request.dto';
import { Types, Document } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { IS_SOFT_DELETED_KEY } from '../schemas/common/soft-delete.schema';
import { EquipmentdbService } from '../equipment/equipment-db.service';
import { ReactiveDbService } from '../reactive/reactive-db.service';
import { MaterialDbService } from '../material/material-db.service';

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

  async add(request: Request) {
    const [, availabilityErr] = await handlePromise<unknown, string>(
      this.checkItemsAvailability(request),
    );

    if (availabilityErr) {
      throw availabilityErr;
    }

    const [id, err] = await handlePromise<unknown, Error>(
      this.dbService.add(request),
    );

    if (err) {
      throw new BackendException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { id };
  }

  private async checkItemsAvailability(request: Request) {
    const [areEquipmentsAvailable, equipmentErr] = await handlePromise<
      unknown,
      string
    >(this.areEquipmentsAvailable(request.equipments));

    if (equipmentErr) {
      throw new BackendException(
        equipmentErr,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!areEquipmentsAvailable) {
      throw new BackendException(
        'Equipments are not available',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [areMaterialsAvailable, materialsErr] = await handlePromise<
      unknown,
      string
    >(this.areMaterialsAvailable(request.materials));

    if (materialsErr) {
      throw new BackendException(
        materialsErr,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!areMaterialsAvailable) {
      throw new BackendException(
        'Materials are not available',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [areReactivesAvailable, reactivesErr] = await handlePromise<
      unknown,
      string
    >(this.areReactivesAvailable(request.reactives));

    if (reactivesErr) {
      throw new BackendException(
        reactivesErr,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!areReactivesAvailable) {
      throw new BackendException(
        'Reactives are not available',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async areReactivesAvailable(
    requestedReactives: ReactiveRequest[],
  ): Promise<Boolean> {
    return this.fetchItemsAndCheckAvailability(
      requestedReactives,
      this.reactiveDbService as any,
    );
  }

  private async areMaterialsAvailable(
    requestedMaterials: MaterialRequest[],
  ): Promise<Boolean> {
    return this.fetchItemsAndCheckAvailability(
      requestedMaterials,
      this.materialDbService as any,
    );
  }

  private async areEquipmentsAvailable(
    requestedEquipments: EquipmentRequest[],
  ): Promise<Boolean> {
    return this.fetchItemsAndCheckAvailability(
      requestedEquipments,
      this.equipmentDbService as any,
    );
  }

  private async fetchItemsAndCheckAvailability(
    requestedItems: RequestableElement[],
    fetchDbService: {
      getAll: (
        isAvailable: boolean,
      ) => Promise<Document<HasEnoughStockAvailable>[]>;
    },
  ): Promise<Boolean> {
    const [availableItems, err] = await handlePromise<
      Document<HasEnoughStockAvailable>[],
      string
    >(fetchDbService.getAll(true));

    if (err) {
      throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return this.areItemsAvailable(requestedItems, availableItems);
  }

  private areItemsAvailable(
    requestedItems: RequestableElement[],
    availableItems: Document<HasEnoughStockAvailable>[],
  ): boolean {
    let availableItemsMap = availableItems.reduce(
      (acc, e) => (acc[e._id.toString()] = e),
      {},
    );

    for (let request of requestedItems) {
      const availableItem = availableItemsMap[request.id.toString()];

      if (
        !availableItem ||
        !availableItem?.hasEnoughStockAvailable(request.amount)
      )
        return false;
    }

    return true;
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

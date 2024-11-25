import { HttpStatus } from '@nestjs/common';
import { Document } from 'mongoose';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import {
  EquipmentRequest,
  HasEnoughStockAvailable,
  MaterialRequest,
  ReactiveRequest,
  RequestableElement,
  Request,
} from '../schemas/request.schema';
import { EquipmentdbService } from '../equipment/equipment-db.service';
import { ReactiveDbService } from '../reactive/reactive-db.service';
import { MaterialDbService } from '../material/material-db.service';

export async function checkItemsAvailability(
  request: Partial<Request>,
  equipmentDbService: EquipmentdbService,
  reactiveDbService: ReactiveDbService,
  materialDbService: MaterialDbService,
): Promise<{ available: boolean; err?: string }> {
  const [_areEquipmentsAvailable, equipmentErr] = await handlePromise<
    unknown,
    string
  >(areEquipmentsAvailable(request.equipments, equipmentDbService));

  if (equipmentErr) {
    throw new BackendException(equipmentErr, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!_areEquipmentsAvailable) {
    return {
      available: false,
      err: 'One or more equipments are not available',
    };
  }

  const [_areMaterialsAvailable, materialsErr] = await handlePromise<
    unknown,
    string
  >(areMaterialsAvailable(request.materials, materialDbService));

  if (materialsErr) {
    throw new BackendException(materialsErr, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!_areMaterialsAvailable) {
    return { available: false, err: 'One or more materials are not available' };
  }

  const [_areReactivesAvailable, reactivesErr] = await handlePromise<
    unknown,
    string
  >(areReactivesAvailable(request.reactives, reactiveDbService));

  if (reactivesErr) {
    throw new BackendException(reactivesErr, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!_areReactivesAvailable) {
    return { available: false, err: 'One or more reactives are not available' };
  }

  return { available: true };
}

async function areReactivesAvailable(
  requestedReactives: ReactiveRequest[],
  reactiveDbService: ReactiveDbService,
): Promise<boolean> {
  return fetchItemsAndCheckAvailability(
    requestedReactives,
    reactiveDbService as any,
  );
}

async function areMaterialsAvailable(
  requestedMaterials: MaterialRequest[],
  materialDbService: MaterialDbService,
): Promise<boolean> {
  return fetchItemsAndCheckAvailability(
    requestedMaterials,
    materialDbService as any,
  );
}

async function areEquipmentsAvailable(
  requestedEquipments: EquipmentRequest[],
  equipmentDbService: EquipmentdbService,
): Promise<boolean> {
  return fetchItemsAndCheckAvailability(
    requestedEquipments,
    equipmentDbService as any,
  );
}

async function fetchItemsAndCheckAvailability(
  requestedItems: RequestableElement[],
  fetchDbService: {
    getAll: (
      isAvailable: boolean,
    ) => Promise<Document<HasEnoughStockAvailable>[]>;
  },
): Promise<boolean> {
  if (!requestedItems) return true;

  const [availableItems, err] = await handlePromise<
    Document<HasEnoughStockAvailable>[],
    string
  >(fetchDbService.getAll(true));

  if (err) {
    throw new BackendException(err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  return areItemsAvailable(requestedItems, availableItems);
}

function areItemsAvailable(
  requestedItems: RequestableElement[],
  availableItems: Document<HasEnoughStockAvailable>[],
): boolean {
  const availableItemsMap = availableItems.reduce(
    (acc, e) => (acc[e._id.toString()] = e),
    {},
  );

  for (const request of requestedItems) {
    const availableItem = availableItemsMap[request.id.toString()];

    if (
      !availableItem ||
      !availableItem?.hasEnoughStockAvailable(request.amount)
    )
      return false;
  }

  return true;
}

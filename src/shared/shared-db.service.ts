import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import handlePromise from '../utils/promise';
import { Model } from 'mongoose';

import { Equipment } from '../schemas/requestable/equipment.schema';
import { Reactive } from '../schemas/requestable/reactive.schema';
import { Material } from '../schemas/requestable/material.schema';
import {
  cantGetusedEquipments,
  cantGetusedMaterials,
  cantGetusedReactives,
} from './shared.error';

@Injectable()
export class SharedDbService {
  constructor(
    @InjectModel(Request.name)
    private requestModel: Model<Request>,
  ) {}

  async getMaterialInuse() {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const [requestWithMaterial, err] = await handlePromise(
      this.requestModel.aggregate([
        // filter by date
        { $match: { date: { $gte: tenDaysAgo } } },

        // any material as a individual component
        { $unwind: '$materials' },

        // group by materials and sum 'quantity'
        {
          $group: {
            _id: '$materials.material',
            totalQuantity: { $sum: '$materials.quantity' },
          },
        },

        // we are not returning  1 , in this case _id is materials.material
        { $project: { _id: 1, totalQuantity: 1 } },
      ]),
    );

    if (err) {
      return new Error(cantGetusedMaterials(err));
    }

    return requestWithMaterial;
  }

  async getEquipmentInuse() {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const [requestWithEquipment, err] = await handlePromise(
      this.requestModel.aggregate([
        { $match: { date: { $gte: tenDaysAgo } } },
        { $unwind: '$equipments' },
        {
          $group: {
            _id: '$equipments.equipment',
            totalQuantity: { $sum: '$equipments.quantity' },
          },
        },
        { $project: { _id: 1, totalQuantity: 1 } },
      ]),
    );

    if (err) {
      return new Error(cantGetusedEquipments(err));
    }

    return requestWithEquipment;
  }

  async getReactiveInuse() {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const [requestWithReactive, err] = await handlePromise(
      this.requestModel.aggregate([
        { $match: { date: { $gte: tenDaysAgo } } },
        { $unwind: '$reactives' },
        {
          $group: {
            _id: '$reactives.reactive',
            totalQuantity: { $sum: '$reactives.quantity' },
          },
        },
        { $project: { _id: 1, totalQuantity: 1 } },
      ]),
    );

    if (err) {
      return new Error(cantGetusedReactives(err));
    }

    return requestWithReactive;
  }
}

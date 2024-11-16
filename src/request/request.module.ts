import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from '../schemas/request.schema';

import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { RequestDbService } from './request-db.service';
import { ConfigModule } from '@nestjs/config';
import {
  Equipment,
  EquipmentSchema,
} from '../schemas/requestable/equipment.schema';
import { EquipmentdbService } from '../equipment/equipment-db.service';
import {
  Material,
  MaterialSchema,
} from '../schemas/requestable/material.schema';
import {
  Reactive,
  ReactiveSchema,
} from '../schemas/requestable/reactive.schema';
import { MaterialDbService } from '../material/material-db.service';
import { ReactiveDbService } from '../reactive/reactive-db.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
    MongooseModule.forFeature([
      { name: Material.name, schema: MaterialSchema },
    ]),
    MongooseModule.forFeature([
      { name: Reactive.name, schema: ReactiveSchema },
    ]),
  ],
  providers: [
    RequestDbService,
    RequestService,
    EquipmentdbService,
    MaterialDbService,
    ReactiveDbService,
  ],
  controllers: [RequestController],
})
export class RequestModule {}

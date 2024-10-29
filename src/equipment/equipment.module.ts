import { Module } from '@nestjs/common';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Equipment,
  EquipmentSchema,
} from '../schemas/requestable/equipment.schema';
import { EquipmentdbService } from './equipment-db.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService, EquipmentdbService],
})
export class EquipmentModule {}

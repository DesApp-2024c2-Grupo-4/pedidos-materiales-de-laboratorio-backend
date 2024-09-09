import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Material,
  MaterialSchema,
} from 'src/schemas/requestable/material.schema';
import { MaterialController } from './material.controller';
import { MaterialDbService } from './material-db.service';
import { MaterialService } from './material.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Material.name, schema: MaterialSchema },
    ]),
  ],
  controllers: [MaterialController],
  providers: [MaterialDbService, MaterialService],
})
export class MaterialModule {}

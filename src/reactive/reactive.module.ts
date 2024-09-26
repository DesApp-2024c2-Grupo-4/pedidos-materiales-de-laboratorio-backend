import { Module } from '@nestjs/common';
import { ReactiveController } from './reactive.controller';
import { ReactiveService } from './reactive.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Reactive,
  ReactiveSchema,
} from '../schemas/requestable/reactive.schema';
import { ReactiveDbService } from './reactive-db.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reactive.name, schema: ReactiveSchema },
    ]),
  ],
  controllers: [ReactiveController],
  providers: [ReactiveService, ReactiveDbService],
})
export class ReactiveModule {}

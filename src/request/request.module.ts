import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from 'src/schemas/request.schema';

import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { RequestDbService } from './request-db.service';


@Module({
  imports: [MongooseModule.forFeature([
    { name: Request.name, schema: RequestSchema },
  ])],
  providers: [RequestDbService,RequestService],
  controllers: [RequestController]
})
export class RequestModule { }

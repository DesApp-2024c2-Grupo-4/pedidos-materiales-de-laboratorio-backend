import { Module } from '@nestjs/common';

import { ConversationService } from './conversation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from '../schemas/conversation.schema';
import { ConversationDbService } from './conversation-db.service';
import { UserDbService } from '../user/user-db.service';
import { User, UserSchema } from '../schemas/user.schema';
import { ConversationGateway } from './conversation.gateway';
import { RequestDbService } from '../request/request-db.service';
import { Request, RequestSchema } from '../schemas/request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
  ],
  controllers: [],
  providers: [
    ConversationService,
    ConversationDbService,
    RequestDbService,
    UserDbService,
    ConversationGateway,
  ],
})
export class ConversationModule {}

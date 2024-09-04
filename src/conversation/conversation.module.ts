import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from '../schemas/conversation.schema';
import { ConversationDbService } from './conversation-db.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationDbService],
})
export class ConversationModule {}

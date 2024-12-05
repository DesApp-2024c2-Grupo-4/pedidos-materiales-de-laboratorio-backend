import { Injectable } from '@nestjs/common';
import handlePromise from '../utils/promise';
import { ConversationDbService } from './conversation-db.service';
import { Types } from 'mongoose';
import { UserDbService } from '../user/user-db.service';
import { cantAddMessage } from './conversation.errors';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ConversationService {
  constructor(
    private readonly dbService: ConversationDbService,
    private readonly dbUserService: UserDbService,
  ) {}

  async get(id: Types.ObjectId) {
    const [conversation, getErr] = await handlePromise(this.dbService.get(id));

    if (getErr) {
      throw new WsException((getErr as Error).message);
    }

    if (!conversation) {
      throw new WsException(`Conversation ${id} not found`);
    }

    return conversation;
  }

  async addMessage(
    id: Types.ObjectId,
    ownerId: Types.ObjectId,
    content: string,
  ) {
    const [conversation, getConversationErr] = await handlePromise(
      this.dbService.get(id),
    );

    if (getConversationErr) {
      throw new WsException(cantAddMessage(id, ownerId, getConversationErr));
    }

    if (!conversation) {
      throw new WsException(`Conversation with id ${id} not found`);
    }

    const [user, getUserErr] = await handlePromise(
      this.dbUserService.get(ownerId),
    );

    if (getUserErr) {
      throw new WsException(cantAddMessage(id, ownerId, getUserErr));
    }

    if (!user) {
      throw new WsException(`User with id ${ownerId} not found`);
    }

    conversation.addMessage(ownerId, content);

    const [, saveErr] = await handlePromise(conversation.save());

    if (saveErr) {
      throw new WsException(cantAddMessage(id, ownerId, saveErr));
    }
  }
}

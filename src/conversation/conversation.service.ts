import { HttpStatus, Injectable } from '@nestjs/common';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { ConversationDbService } from './conversation-db.service';
import { Types } from 'mongoose';
import { UserDbService } from '../user/user-db.service';
import { cantAddMessage } from './conversation.errors';

@Injectable()
export class ConversationService {
  constructor(
    private readonly dbService: ConversationDbService,
    private readonly dbUserService: UserDbService,
  ) {}

  async get(id: Types.ObjectId) {
    const [conversation, getErr] = await handlePromise(this.dbService.get(id));

    if (getErr) {
      throw new BackendException(
        (getErr as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!conversation) {
      throw new BackendException('', 404);
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
      throw new BackendException(
        cantAddMessage(id, ownerId, getConversationErr),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!conversation) {
      throw new BackendException(
        `Conversation with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const [user, getUserErr] = await handlePromise(
      this.dbUserService.get(ownerId),
    );

    if (getUserErr) {
      throw new BackendException(
        cantAddMessage(id, ownerId, getUserErr),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!user) {
      throw new BackendException(
        `User with id ${ownerId} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    conversation.addMessage(ownerId, content);

    const [, saveErr] = await handlePromise(conversation.save());

    if (saveErr) {
      throw new BackendException(
        cantAddMessage(id, ownerId, saveErr),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

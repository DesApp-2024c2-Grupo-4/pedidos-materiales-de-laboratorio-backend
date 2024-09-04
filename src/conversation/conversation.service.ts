import { HttpStatus, Injectable } from '@nestjs/common';
import handlePromise from '../utils/promise';
import { BackendException } from '../shared/backend.exception';
import { ConversationDbService } from './conversation-db.service';
import { Conversation } from '../schemas/conversation.schema';

@Injectable()
export class ConversationService {
  constructor(private readonly dbService: ConversationDbService) {}

  async getConversationById(id: string) {
    const [conversation, getErr] = await handlePromise<Conversation, Error>(
      this.dbService.getConversationById(id),
    );

    if (getErr) {
      throw new BackendException(
        getErr.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!conversation) {
      throw new BackendException('', 404);
    }

    return conversation;
  }
}

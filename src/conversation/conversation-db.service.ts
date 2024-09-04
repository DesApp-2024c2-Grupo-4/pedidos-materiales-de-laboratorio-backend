import { Injectable } from '@nestjs/common';
import { Conversation } from '../schemas/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import handlePromise from 'src/utils/promise';

@Injectable()
export class ConversationDbService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async createConversation(requestId: string) {
    const [conversation, createErr] = await handlePromise(
      this.conversationModel.create(),
    );
  }

  async getConversationById(id: string) {
    const [conversation, getErr] = await handlePromise(
      this.conversationModel.findOne({
        _id: id,
      }),
    );

    if (getErr) {
      throw new Error(
        `Cannot get Conversation with id ${id}. Reason: ${getErr}`,
      );
    }

    return conversation;
  }
}

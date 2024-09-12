import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import handlePromise from 'src/utils/promise';
import { Conversation } from '../schemas/conversation.schema';
import {
  cantCreateConversation,
  cantGetConversation,
} from './conversation.errors';

@Injectable()
export class ConversationDbService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async createConversation(): Promise<Types.ObjectId> {
    const [conversation, createErr] = await handlePromise(
      this.conversationModel.create({}),
    );

    if (createErr) {
      throw new Error(cantCreateConversation(createErr));
    }

    return conversation._id;
  }

  async getConversationById(id: Types.ObjectId) {
    const [conversation, getErr] = await handlePromise(
      this.conversationModel.findOne({
        _id: id,
      }),
    );

    if (getErr) {
      throw new Error(cantGetConversation(id, getErr));
    }

    return conversation;
  }
}

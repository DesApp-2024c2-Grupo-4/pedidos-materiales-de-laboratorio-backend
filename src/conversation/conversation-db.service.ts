import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import handlePromise from '../utils/promise';
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

  async add(): Promise<Types.ObjectId> {
    const [conversation, createErr] = await handlePromise(
      this.conversationModel.create({}),
    );

    if (createErr) {
      throw new Error(cantCreateConversation(createErr));
    }

    return conversation._id;
  }

  async get(id: Types.ObjectId) {
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

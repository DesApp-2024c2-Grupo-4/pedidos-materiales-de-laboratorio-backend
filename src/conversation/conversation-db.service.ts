import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import handlePromise from 'src/utils/promise';

/* Schemas */
import { User } from '../schemas/user.schema';
import { Conversation, Message } from '../schemas/conversation.schema';
import {
  cantCreateConversation,
  cantCreateMessage,
  cantGetConversation,
} from './conversation.errors';

@Injectable()
export class ConversationDbService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async createConversation(): Promise<Conversation> {
    const [conversation, createErr] = await handlePromise(
      this.conversationModel.create({}),
    );

    if (createErr) {
      throw new Error(cantCreateConversation(createErr));
    }

    return conversation;
  }

  async getConversationById(id: Types.ObjectId): Promise<Conversation> {
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

  async addMessage(
    conversationId: Types.ObjectId,
    ownerId: Types.ObjectId,
    content: string,
  ) {
    const [conversation, getConversationErr] = await handlePromise(
      this.conversationModel.findOne({
        _id: conversationId,
      }),
    );

    if (getConversationErr) {
      throw new Error(
        cantCreateMessage(conversationId, ownerId, getConversationErr),
      );
    }

    const [owner, getOwnerErr] = await handlePromise(
      this.userModel.findOne({
        _id: ownerId,
      }),
    );

    if (getOwnerErr) {
      throw new Error(cantCreateMessage(conversationId, ownerId, getOwnerErr));
    }

    const message = new Message(owner._id, content);
    conversation.messages.push(message);

    const [, saveConversationErr] = await handlePromise(conversation.save());

    if (getOwnerErr) {
      throw new Error(
        cantCreateMessage(conversationId, ownerId, saveConversationErr),
      );
    }

    return;
  }
}

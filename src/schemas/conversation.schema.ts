import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MongooseModels } from '../const/mongoose.const';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema()
export class Message {
  @Prop({ required: true, type: Types.ObjectId, ref: MongooseModels.USER })
  ownerId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, type: [Types.ObjectId] })
  read: Types.ObjectId[];

  constructor(ownerId: Types.ObjectId, message: string) {
    this.ownerId = ownerId;
    this.message = message;
    this.read = [];
  }
}

@Schema()
export class Conversation {
  @Prop({ type: [Message] })
  messages: Message[];
}

export const ConversationSchema = SchemaFactory.createForClass(Message);

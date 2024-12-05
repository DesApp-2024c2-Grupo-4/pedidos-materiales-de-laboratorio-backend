import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from './user.schema';
import { IsObjectId } from '../utils/validation/id.validator';

export type ConversationDocument = HydratedDocument<Conversation>;
export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @IsObjectId({ message: 'Id should be in Mongo ObjectId format' })
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  ownerId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, type: [Types.ObjectId], ref: User.name })
  read: Types.ObjectId[];

  @Prop({ required: true, type: [Types.ObjectId], ref: User.name })
  delivered: Types.ObjectId[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Type(() => Date)
  @Prop()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Prop()
  updatedAt?: Date;

  constructor(ownerId: Types.ObjectId, message: string) {
    this.ownerId = ownerId;
    this.message = message;
    this.read = [];
  }
}

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: [Message], default: [] })
  messages: Message[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Prop()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Prop()
  updatedAt?: Date;

  addMessage: (ownerId: Types.ObjectId, content: string) => void;
  readMessages: (userId: Types.ObjectId, messages: Types.ObjectId[]) => void;
  deliverMessages: (userId: Types.ObjectId, messages: Types.ObjectId[]) => void;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.methods.addMessage = function (
  ownerId: Types.ObjectId,
  content: string,
): void {
  this.messages.push(new Message(ownerId, content));
};

ConversationSchema.methods.readMessages = function (
  userId: Types.ObjectId,
  messages: Types.ObjectId[],
): void {
  const messagesDict = messages.reduce((d, v) => {
    d[v.toString()] = v;
    return d;
  }, {});

  this.messages.forEach((m: MessageDocument) => {
    if (!messagesDict[m._id.toString()]) return;
    const readList = m.read.map((id) => id.toString());
    if (readList.includes(userId.toString())) return;
    m.read.push(userId);
  });
};

ConversationSchema.methods.deliverMessages = function (
  userId: Types.ObjectId,
  messages: Types.ObjectId[],
): void {
  const messagesDict = messages.reduce((d, v) => {
    d[v.toString()] = v;
    return d;
  }, {});

  this.messages.forEach((m: MessageDocument) => {
    if (!messagesDict[m._id.toString()]) return;
    const deliveredList = m.delivered.map((id) => id.toString());
    if (deliveredList.includes(userId.toString())) return;
    m.delivered.push(userId);
  });
};

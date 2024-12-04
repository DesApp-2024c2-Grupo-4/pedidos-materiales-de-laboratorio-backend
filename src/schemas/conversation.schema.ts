import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from './user.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  ownerId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, type: [Types.ObjectId] })
  read: Types.ObjectId[];

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
  @Prop({ type: [Message] })
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

  addMessage: (ownerId: Types.ObjectId, content: string) => Promise<void>;
}

export const ConversationSchema = SchemaFactory.createForClass(Message);

ConversationSchema.methods.addMessage = async function (
  ownerId: Types.ObjectId,
  content: string,
): Promise<void> {
  return this.messages.push(new Message(ownerId, content));
};

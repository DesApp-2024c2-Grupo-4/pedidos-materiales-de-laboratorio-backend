import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MongooseModels } from '../const/mongoose.const';
import { IsDate, IsOptional } from 'class-validator';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, type: Types.ObjectId, ref: MongooseModels.USER })
  ownerId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, type: [Types.ObjectId] })
  read: Types.ObjectId[];

  @IsOptional()
  @IsDate()
  @Prop()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
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
  @Prop()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
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

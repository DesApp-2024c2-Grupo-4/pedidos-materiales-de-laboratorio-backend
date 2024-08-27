import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MailDocument = HydratedDocument<Mail>;

@Schema()
export class Message {
  @Prop()
  name: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  read: boolean;
}

@Schema()
export class Mail {
  @Prop({ type: Types.ObjectId, ref: 'Request' })
  _id: Types.ObjectId;

  @Prop({ type: [Message] })
  messageList: Message[];
}

export const MailSchema = SchemaFactory.createForClass(Mail);

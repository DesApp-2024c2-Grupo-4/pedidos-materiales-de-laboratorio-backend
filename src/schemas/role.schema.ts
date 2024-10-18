import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SoftDelete } from './common/soft-delete.schema';
import { IsArray } from 'class-validator';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role extends SoftDelete {
  @Prop({ required: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @IsArray()
  @Prop({ type: [Types.ObjectId] })
  userList: Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);



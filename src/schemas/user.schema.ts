import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SoftDelete } from './common/soft-delete.schema';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RolesValue } from '../const/roles.const';
import { Type } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends SoftDelete {
  @IsEmail()
  @Prop({ required: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  lastName: string;

  @IsNumber()
  @Prop({ required: true })
  dni: number;

  @IsOptional()
  @IsNumber()
  @Prop()
  licenceNumber?: number; // FIXME: Why do we need this? also let's pick a name for this attribute

  @Prop({ required: true })
  roles: RolesValue[];

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

  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    throw new Error('Failed to create hashed password: ' + error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

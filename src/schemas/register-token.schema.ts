import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MongooseModels } from '../const/mongoose.const';
import { IsEmail, IsOptional } from 'class-validator';
import { IsObjectId } from '../utils/id-validator';
import { IS_SOFT_DELETED_KEY, SoftDelete } from './common/soft-delete.schema';

export type RegisterTokenDocument = HydratedDocument<RegisterToken>;

@Schema()
export class RegisterToken extends SoftDelete {
  @IsObjectId({ message: 'Id should be in Mongo ObjectId format' })
  @Prop({ required: true, type: Types.ObjectId, ref: MongooseModels.USER })
  creatorId: Types.ObjectId;

  @Prop({ required: false, type: Date })
  creationDate: Date;

  @Prop({ required: false, type: Date })
  consumedDate: Date;

  @IsObjectId({ message: 'Id should be in Mongo ObjectId format' })
  @Prop({ required: false, type: Types.ObjectId, ref: MongooseModels.USER })
  userCreated: Types.ObjectId;

  /* Optional, if specified only that email can register using the token */
  @IsEmail()
  @IsOptional()
  @Prop({ required: false, type: String })
  createdFor: string;

  consume: (createdUserId: Types.ObjectId) => Promise<void>;

  isConsumed: () => Boolean;
  isAvailable: () => Boolean;

  constructor(creatorId: Types.ObjectId, createdFor?: string) {
    super();
    this.creatorId = creatorId;
    this.creationDate = new Date(Date.now());

    if (createdFor) {
      this.createdFor = createdFor;
    }
  }
}

export const RegisterTokenSchema = SchemaFactory.createForClass(RegisterToken);

RegisterTokenSchema.methods.consume = async function (
  createdUserId: Types.ObjectId,
): Promise<void> {
  this.consumedDate = new Date(Date.now());
  this.userCreated = createdUserId;
};

RegisterTokenSchema.methods.isConsumed = function (): boolean {
  return !!this.userCreated;
};

RegisterTokenSchema.methods.isAvailable = function (): boolean {
  return !this.isConsumed() && !this[IS_SOFT_DELETED_KEY];
};

RegisterTokenSchema.pre<RegisterTokenDocument>('save', function (next) {
  if (this.isNew) {
    this.creationDate = new Date();
  }
  next();
});

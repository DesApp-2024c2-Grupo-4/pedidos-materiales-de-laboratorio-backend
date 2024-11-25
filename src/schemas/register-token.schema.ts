import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MongooseModels } from '../const/mongoose.const';
import { IsDate, IsEmail, IsOptional } from 'class-validator';
import { IsObjectId } from '../utils/validation/id.validator';
import { IS_SOFT_DELETED_KEY, SoftDelete } from './common/soft-delete.schema';
import { Roles, RolesKeys } from '../const/roles.const';

export type RegisterTokenDocument = HydratedDocument<RegisterToken>;

@Schema({ timestamps: true })
export class RegisterToken extends SoftDelete {
  @IsObjectId({ message: 'Id should be in Mongo ObjectId format' })
  @Prop({ required: true, type: Types.ObjectId, ref: MongooseModels.USER })
  creatorId: Types.ObjectId;

  @Prop({ required: false, type: Date })
  consumedDate: Date;

  @IsObjectId({ message: 'Id should be in Mongo ObjectId format' })
  @Prop({ required: false, type: Types.ObjectId, ref: MongooseModels.USER })
  userCreated: Types.ObjectId;

  @IsOptional()
  @IsDate()
  @Prop()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Prop()
  updatedAt?: Date;

  /**
   *  Optional: if specified only that email can register using the token
   */
  @IsEmail()
  @IsOptional()
  @Prop({ required: false, type: String })
  createdFor?: string;

  /**
   *  Optional: if specified this roles will be automatically asigned to the
   *  user created with that token
   */
  @IsOptional()
  @Prop({ enum: Object.keys(Roles) })
  roles?: RolesKeys[];

  consume: (createdUserId: Types.ObjectId) => Promise<void>;

  isConsumed: () => boolean;
  isAvailable: () => boolean;

  constructor(creatorId: Types.ObjectId, createdFor?: string) {
    super();
    this.creatorId = creatorId;

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

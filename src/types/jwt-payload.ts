import { Types } from 'mongoose';
import { User } from '../schemas/user.schema';

export type AccessTokenPayload = Pick<
  User,
  'role' | 'name' | 'lastName' | 'email'
> & { id: Types.ObjectId };

export type RefreshTokenPayload = Pick<User, 'email'>;

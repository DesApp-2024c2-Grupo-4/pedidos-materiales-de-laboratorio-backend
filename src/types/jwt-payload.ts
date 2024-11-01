import { Types } from 'mongoose';
import { User } from '../schemas/user.schema';

export type AccessTokenPayload = Pick<
  User,
  'role' | 'name' | 'lastName' | 'email'
> & { id: Types.ObjectId; iat?: number; exp?: number };

export type RefreshTokenPayload = Pick<User, 'email'>;

import { User } from '../schemas/user.schema';

export type AccessTokenPayload = Pick<
  User,
  'role' | 'name' | 'lastName' | 'email'
>;

export type RefreshTokenPayload = Pick<User, 'email'>;

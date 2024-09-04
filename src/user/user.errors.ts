import { Types } from 'mongoose';

export function cantCreateUser(email: string, reason: unknown): string {
  return `Cannot create user ${email}. Reason: ${reason}`;
}

export function cantGetUser(id: Types.ObjectId, reason: unknown): string {
  return `Cannot get user with id ${id}. Reason: ${reason}`;
}

export function cantGeteUserByEmail(email: string, reason: unknown): string {
  return `Cannot get user ${email}. Reason: ${reason}`;
}

import { Types } from 'mongoose';

export function cantGet(roleId: Types.ObjectId, reason: unknown): string {
  return `Cannot get role with id ${roleId}. Reason: ${reason}`;
}

export function cantGetRoles(reason: unknown): string {
  return `Cannot get roles. Reason: ${reason}`;
}

export function cantUpdate(
  roleId: Types.ObjectId,
  reason: unknown,
): string {
  return `Cannot update role with id ${roleId}. Reason: ${reason}`;
}

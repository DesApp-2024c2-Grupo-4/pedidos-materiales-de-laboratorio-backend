import { Types } from 'mongoose';

export function cantCreateToken(reason: unknown) {
  return `Cannot create register token. Reason: ${reason}`;
}
export function cantGetToken(reason: unknown) {
  return `Cannot get register token. Reason: ${reason}`;
}
export function cantGetTokenById(tokenId: Types.ObjectId, reason: unknown) {
  return `Cannot get register token with id ${tokenId}. Reason: ${reason}`;
}
export function cantDeleteToken(tokenId: Types.ObjectId, reason: unknown) {
  return `Cannot delete register token with id ${tokenId}. Reason: ${reason}`;
}

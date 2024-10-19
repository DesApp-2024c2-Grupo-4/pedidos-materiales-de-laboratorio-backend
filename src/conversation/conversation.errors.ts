import { Types } from 'mongoose';

export function cantCreateMessage(
  conversationId: Types.ObjectId,
  ownerId: Types.ObjectId,
  reason: unknown,
): string {
  return `Cannot create message for conversation ${conversationId}, user ${ownerId}. Reason: ${reason}`;
}

export function cantGetConversation(
  conversationId: Types.ObjectId,
  reason: unknown,
): string {
  return `Cannot get Conversation with id ${conversationId}. Reason: ${reason}`;
}

export function cantCreateConversation(reason: unknown): string {
  return `Cannot create Conversation. Reason: ${reason}`;
}

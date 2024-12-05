import { Types } from 'mongoose';

export function cantAddMessage(
  conversationId: Types.ObjectId,
  ownerId: Types.ObjectId,
  reason: unknown,
): string {
  return `Cannot add message for conversation ${conversationId}, user ${ownerId}. Reason: ${reason}`;
}

export function cantReadMessages(
  conversationId: Types.ObjectId,
  userId: Types.ObjectId,
  reason: unknown,
): string {
  return `Cannot read messages for conversation ${conversationId.toString()}, user ${userId.toString()}. Reason: ${reason}`;
}

export function cantDeliverMessages(
  conversationId: Types.ObjectId,
  userId: Types.ObjectId,
  reason: unknown,
): string {
  return `Cannot deliver messages for conversation ${conversationId.toString()}, user ${userId.toString()}. Reason: ${reason}`;
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

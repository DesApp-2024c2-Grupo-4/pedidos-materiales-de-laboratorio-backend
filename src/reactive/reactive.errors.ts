import { Types } from 'mongoose';

export function cantCreateReactive(reason: unknown) {
  return `Cannot create Reactive with id . Reason: ${reason}`;
}
export function cantGetRactives(reason: unknown) {
  return `Cannot get reactives Reason: ${reason}`;
}
export function cantGetReactive(ReactiveId: Types.ObjectId, reason: unknown) {
  return `Cannot get reactive with id ${ReactiveId}. Reason: ${reason}`;
}
export function cantUpdateReactive(
  ReactiveId: Types.ObjectId,
  reason: unknown,
) {
  return `Cannot update reactive with id ${ReactiveId}. Reason: ${reason}`;
}
export function cantDeleteReactive(
  ReactiveId: Types.ObjectId,
  reason: unknown,
) {
  return `Cannot delete reactive with id ${ReactiveId}. Reason: ${reason}`;
}

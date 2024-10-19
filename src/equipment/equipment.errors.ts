import { Types } from 'mongoose';

export function cantCreateEquipment(reason: unknown) {
  return `Cannot create Equipment. Reason: ${reason}`;
}
export function cantGetEquipment(reason: unknown) {
  return `Cannot get equipments. Reason: ${reason}`;
}
export function cantGetEquipmentById(
  EquipmentId: Types.ObjectId,
  reason: unknown,
) {
  return `Cannot get equipment with id ${EquipmentId}. Reason: ${reason}`;
}
export function cantUpdateEquipment(
  EquipmentId: Types.ObjectId,
  reason: unknown,
) {
  return `Cannot update equipment with id ${EquipmentId}. Reason: ${reason}`;
}
export function cantDeleteEquipment(
  EquipmentId: Types.ObjectId,
  reason: unknown,
) {
  return `Cannot delete equipment with id ${EquipmentId}. Reason: ${reason}`;
}

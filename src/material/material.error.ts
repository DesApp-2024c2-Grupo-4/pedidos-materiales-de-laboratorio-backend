import { Types } from 'mongoose';

export function cantCreateMaterial(
  materialName: string,
  reason: unknown,
): string {
  return `Cannot create material ${materialName}. Reason: ${reason}`;
}

export function cantGet(materialId: Types.ObjectId, reason: unknown): string {
  return `Cannot get material with id ${materialId}. Reason: ${reason}`;
}

export function cantGetMaterials(reason: unknown): string {
  return `Cannot get materials. Reason: ${reason}`;
}

export function cantUpdate(
  materialId: Types.ObjectId,
  reason: unknown,
): string {
  return `Cannot update material with id ${materialId}. Reason: ${reason}`;
}

export function cantDelete(
  materialId: Types.ObjectId,
  reason: unknown,
): string {
  return `Cannot delete material with id ${materialId}. Reason: ${reason}`;
}

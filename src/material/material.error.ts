import { Types } from 'mongoose';

export function cantCreateMaterial(
  materialName: string,
  reason: unknown,
): string {
  return `Cannot create Material ${materialName}. Reason: ${reason}`;
}

export function cantGet(materialId: Types.ObjectId, reason: unknown): string {
  return `Cannot get Material with id ${materialId}. Reason: ${reason}`;
}

export function cantGetMaterials(reason: unknown): string {
  return `Cannot get Materials. Reason: ${reason}`;
}

export function cantupdate(
  materialId: Types.ObjectId,
  reason: unknown,
): string {
  return `Cannot update Material with id ${materialId}. Reason: ${reason}`;
}

export function cantdelete(
  materialId: Types.ObjectId,
  reason: unknown,
): string {
  return `Cannot delete Material with id ${materialId}. Reason: ${reason}`;
}

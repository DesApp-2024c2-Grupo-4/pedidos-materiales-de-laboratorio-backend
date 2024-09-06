import { Types } from 'mongoose';

 export function  cantCreateEquipment( reason: unknown,){
    return `Cannot create Equipment with id . Reason: ${reason}`;
} 
 export function  cantSearchEquipment(
    reason: unknown,){
    return `Cannot Search Equipment Reason: ${reason}`;
}
 export function  cantSearchEquipmentById(
    EquipmentId: Types.ObjectId, 
    reason: unknown,){
    return `Cannot Search Equipment with id ${EquipmentId}. Reason: ${reason}`;
}
 export function  cantUpdateEquipment(
    EquipmentId: Types.ObjectId, 
    reason: unknown,){
    return `Cannot Update Equipment with id ${EquipmentId}. Reason: ${reason}`;
} 
 export function  cantDeleteEquipment(
    EquipmentId: Types.ObjectId, 
    reason: unknown,){
    return `Cannot Delete Equipment with id ${EquipmentId}. Reason: ${reason}`;
}

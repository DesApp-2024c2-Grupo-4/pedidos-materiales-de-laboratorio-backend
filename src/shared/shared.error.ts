import { Types } from 'mongoose';

 export function  cantAffectMaterials( reason: unknown,){
    return `Cannot create Request with id . Reason: ${reason}`;
 }

 export function  cantAffectReactives( reason: unknown,){
    return `Cannot affect Reactives . Reason: ${reason}`;
} 


 export function  cantAffectEquipments( reason: unknown,){
    return `Cannot create Request with id . Reason: ${reason}`;
} 
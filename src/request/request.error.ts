import { Types } from 'mongoose';

 export function  cantCreateRequest( reason: unknown,){
    return `Cannot create Request with id . Reason: ${reason}`;
} 
 export function  cantGetRequests(
    reason: unknown,){
    return `Cannot Search Request Reason: ${reason}`;
}
 export function  cantGet(
    RequestId: Types.ObjectId, 
    reason: unknown,){
    return `Cannot Search Request with id ${RequestId}. Reason: ${reason}`;
}
 export function  cantUpdate(
    RequestId: Types.ObjectId, 
    reason: unknown,){
    return `Cannot Update Request with id ${RequestId}. Reason: ${reason}`;
} 
 export function  cantDelete(
    RequestId: Types.ObjectId, 
    reason: unknown,){
    return `Cannot Delete Request with id ${RequestId}. Reason: ${reason}`;
}
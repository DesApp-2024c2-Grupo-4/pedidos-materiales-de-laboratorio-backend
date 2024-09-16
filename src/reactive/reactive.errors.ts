import { Types } from 'mongoose';

 export function  cantCreateReactive( reason: unknown,){
    return `Cannot create Reactive with id . Reason: ${reason}`;
} 
 export function  cantSearchReactive(
    reason: unknown,){
    return `Cannot Search Reactive Reason: ${reason}`;
}
 export function  cantSearchReactiveById(
    ReactiveId: Types.ObjectId, 
    reason: unknown,){
    return `Cannot Search Reactive with id ${ReactiveId}. Reason: ${reason}`;
}
 export function  cantUpdateReactive(
    ReactiveId: Types.ObjectId, 
    reason: unknown,){
    return `Cannot Update Reactive with id ${ReactiveId}. Reason: ${reason}`;
} 
 export function  cantDeleteReactive(
    ReactiveId: Types.ObjectId, 
    reason: unknown,){
    return `Cannot Delete Reactive with id ${ReactiveId}. Reason: ${reason}`;
}
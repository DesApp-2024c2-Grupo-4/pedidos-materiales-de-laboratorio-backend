export const MongooseModels = {
  EQUIPMENT: 'EQUIPMENT',
  USER: 'USER',
  MATERIAL: 'MATERIAL',
  REACTIVE: 'REACTIVE',
  REQUEST: 'REQUEST',
  MESSAGE: 'MESSAGE',
  CONVERSATION: 'CONVERSATION',
} as const;

export type MongooseModel =
  (typeof MongooseModels)[keyof typeof MongooseModels];

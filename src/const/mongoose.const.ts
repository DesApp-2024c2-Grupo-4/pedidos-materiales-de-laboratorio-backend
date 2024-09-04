export const MongooseModels = {
  EQUIPMENT: 'Equipment',
  USER: 'User',
  MATERIAL: 'Material',
  REACTIVE: 'Reactive',
  REQUEST: 'Request',
  MESSAGE: 'Message',
  Conversation: 'Conversation',
} as const;

export type MongooseModel =
  (typeof MongooseModels)[keyof typeof MongooseModels];

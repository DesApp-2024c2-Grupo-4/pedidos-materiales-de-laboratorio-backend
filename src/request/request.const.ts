export const RequestStatuses = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
};

export type RequestStatusesValue =
  (typeof RequestStatuses)[keyof typeof RequestStatuses];

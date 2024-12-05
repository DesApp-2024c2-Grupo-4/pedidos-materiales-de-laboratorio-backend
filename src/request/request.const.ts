export const RequestStatuses = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
} as const;

export type RequestStatusesValue =
  (typeof RequestStatuses)[keyof typeof RequestStatuses];

export type RequestStatus = keyof typeof RequestStatuses;

export const Labs = {
  MA101: 'Malvinas 101',
  MA102: 'Malvinas 102',
  MA103: 'Malvinas 103',
  MA104: 'Malvinas 104',
} as const;

export type LabsKeys = keyof typeof Labs;

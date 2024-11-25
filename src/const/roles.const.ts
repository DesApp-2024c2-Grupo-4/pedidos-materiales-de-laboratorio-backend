export const Roles = {
  ADMIN: 'ADMIN',
  LAB: 'LAB',
  TEACHER: 'TEACHER',
} as const;

export type RolesValue = (typeof Roles)[keyof typeof Roles];

export const RolesKeys = Object.keys(Roles);

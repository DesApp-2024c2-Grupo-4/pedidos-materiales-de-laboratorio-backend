import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_REFRESH_KEY = 'isRefresh';
export const RefreshAuth = () => SetMetadata(IS_REFRESH_KEY, true);

export const ALL_ROLES_KEY = 'all_roles';
export const AllRoles = (...roles: string[]) =>
  SetMetadata(
    ALL_ROLES_KEY,
    roles.map((r) => r.toLocaleLowerCase()),
  );

export const ANY_ROLES_KEY = 'any_roles';
export const AnyRoles = (...roles: string[]) =>
  SetMetadata(
    ANY_ROLES_KEY,
    roles.map((r) => r.toLocaleLowerCase()),
  );

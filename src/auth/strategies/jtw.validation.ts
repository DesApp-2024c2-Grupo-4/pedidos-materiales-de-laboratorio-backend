import { ForbiddenException } from '@nestjs/common';
import { AccessTokenPayload } from '../../types/jwt-payload';

export function validatePermissions(
  user: AccessTokenPayload,
  requiredRolesAll: string[],
  requiredRolesAny: string[],
) {
  if (requiredRolesAll && requiredRolesAny) {
    throw new Error(
      'Conflicting role decorators: use either @RolesAll or @RolesAny, not both.',
    );
  }

  if (
    requiredRolesAll &&
    (!user || !user.roles || !hasAllRoles(user.roles, requiredRolesAll))
  ) {
    throw new ForbiddenException(
      'Access denied: insufficient permissions for all required roles.',
    );
  }

  if (
    requiredRolesAny &&
    (!user || !user.roles || !hasAnyRole(user.roles, requiredRolesAny))
  ) {
    throw new ForbiddenException(
      'Access denied: insufficient permissions for any required roles.',
    );
  }

  return true;
}

export function hasAllRoles(
  userRoles: string[],
  requiredRoles: string[],
): boolean {
  return requiredRoles.every((role) => userRoles.includes(role));
}

export function hasAnyRole(
  userRoles: string[],
  requiredRoles: string[],
): boolean {
  return requiredRoles.some((role) => userRoles.includes(role));
}

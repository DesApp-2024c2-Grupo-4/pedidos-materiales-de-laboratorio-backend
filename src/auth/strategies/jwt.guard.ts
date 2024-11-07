import {
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  ALL_ROLES_KEY,
  ANY_ROLES_KEY,
  IS_PUBLIC_KEY,
} from '../providers/accesor.metadata';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(protected reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    /* Calling super here allows for response.user to be populated with JWT payload */
    const canActivateSuper = await super.canActivate(context);
    if (!canActivateSuper) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const requiredRolesAll = this.reflector.get<string[]>(
      ALL_ROLES_KEY,
      context.getHandler(),
    );
    const requiredRolesAny = this.reflector.get<string[]>(
      ANY_ROLES_KEY,
      context.getHandler(),
    );

    if (requiredRolesAll && requiredRolesAny) {
      throw new Error(
        'Conflicting role decorators: use either @RolesAll or @RolesAny, not both.',
      );
    }

    if (
      requiredRolesAll &&
      (!user || !user.roles || !this.hasAllRoles(user.roles, requiredRolesAll))
    ) {
      throw new ForbiddenException(
        'Access denied: insufficient permissions for all required roles.',
      );
    }

    if (
      requiredRolesAny &&
      (!user || !user.roles || !this.hasAnyRole(user.roles, requiredRolesAny))
    ) {
      throw new ForbiddenException(
        'Access denied: insufficient permissions for any required roles.',
      );
    }

    return true;
  }

  private hasAllRoles(userRoles: string[], requiredRoles: string[]): boolean {
    return requiredRoles.every((role) => userRoles.includes(role));
  }

  private hasAnyRole(userRoles: string[], requiredRoles: string[]): boolean {
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}

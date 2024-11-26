import {
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  ALL_ROLES_KEY,
  ANY_ROLES_KEY,
  IS_PUBLIC_KEY,
} from '../providers/accesor.metadata';
import { hasAllRoles, hasAnyRole, validatePermissions } from './jtw.validation';
import { Socket } from 'socket.io';

@Injectable()
export class JwtSocketAuthGuard extends AuthGuard('jwt-socket') {
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

    const client: Socket = context.switchToWs().getClient<Socket>();
    const token: string | string[] = client.handshake.query.token;

    //Extract the token from query
    if (token === undefined) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const authtoken: string = Array.isArray(token) ? token[0] : token;
    client.data.token = authtoken;

    /* Calling super here allows for response.user to be populated with JWT payload */
    const canActivateSuper = await super.canActivate(context);
    if (!canActivateSuper) return false;

    const request = context.switchToWs().getClient().handshake;
    const user = request.user;

    const requiredRolesAll = this.reflector.get<string[]>(
      ALL_ROLES_KEY,
      context.getHandler(),
    );
    const requiredRolesAny = this.reflector.get<string[]>(
      ANY_ROLES_KEY,
      context.getHandler(),
    );

    return validatePermissions(user, requiredRolesAll, requiredRolesAny);
  }
}

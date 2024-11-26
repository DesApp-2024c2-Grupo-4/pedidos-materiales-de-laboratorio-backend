import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from '../../types/jwt-payload';
import { Socket } from 'socket.io';

@Injectable()
export class JwtSocketStrategy extends PassportStrategy(
  Strategy,
  'jwt-socket',
) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('ACCESS_TOKEN_SECRET');
    super({
      jwtFromRequest: JwtSocketStrategy.extractJWT,
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  private static extractJWT(socket: Socket): string | null {
    if (socket.data.token) {
      return socket.data.token;
    }
    return null;
  }

  async validate(req: any, payload: any): Promise<AccessTokenPayload> {
    const socket: Socket = req;
    (socket.handshake as any).user = payload; // Attach user to handshake
    return payload;
  }
}

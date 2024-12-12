import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  ConversationMessagePayload,
  JoinRoomPayload,
} from '../../conversation/conversation.gateway';
import handlePromise from '../../utils/promise';
import { RequestDocument } from '../../schemas/request.schema';
import { Roles } from '../../const/roles.const';
import { RequestDbService } from '../../request/request-db.service';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class JwtSocketAuthGuard extends AuthGuard('jwt-socket') {
  constructor(
    protected reflector: Reflector,
    private readonly requestDbService: RequestDbService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token: string | string[] = client.handshake.query.token;

    // Extract the token from query
    if (token === undefined) {
      throw new WsException('Unauthorized');
    }

    const authtoken: string = Array.isArray(token) ? token[0] : token;
    client.data.token = authtoken;

    /* Calling super here allows for response.user to be populated with JWT payload */
    const canActivateSuper = await super.canActivate(context);
    if (!canActivateSuper) return false;

    const wsRequest = context.switchToWs().getClient().handshake;
    const user = wsRequest.user;

    if (!user) {
      throw new WsException('User not authenticated');
    }

    const data = context
      .switchToWs()
      .getData<JoinRoomPayload | ConversationMessagePayload>();
    const { requestId } = data;

    if (!requestId) {
      throw new WsException('Request ID not provided');
    }

    if (!isValidObjectId(requestId)) {
      throw new WsException('Request ID is not a valid Mongo ObjectId');
    }

    const [request, err] = await handlePromise<RequestDocument, string>(
      this.requestDbService.get(requestId),
    );

    if (err) {
      throw new WsException('Error while retrieving request from db');
    }

    if (!request) {
      throw new WsException('Request not found');
    }

    const isLabRole = user.roles && user.roles.includes(Roles.LAB);
    const isOwner =
      user.id.toString() === request.requestantUser._id.toString();

    if (!isLabRole && !isOwner) {
      throw new WsException('Access denied');
    }

    (wsRequest as any).requestDocument = request; // Attach request to handshake

    return true;
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtSocketAuthGuard } from '../auth/strategies/jwt-socket.guard';
import { AccessTokenPayload } from 'src/types/jwt-payload';
import { Types } from 'mongoose';

export interface JoinRoomPayload {
  requestId: Types.ObjectId;
}

export interface ConversationMessagePayload {
  requestId: Types.ObjectId;
  message: string;
}

@WebSocketGateway({ cors: true })
@UseGuards(JwtSocketAuthGuard)
@UsePipes(new ValidationPipe())
export class ConversationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server;

  private roomParticipants: Map<string, Set<string>> = new Map();

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);

    // Remove the client from all rooms they were part of
    this.roomParticipants.forEach((clients, roomId) => {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.roomParticipants.delete(roomId);
        }
      }
    });
  }

  @SubscribeMessage('joinRoom')
  joinRoom(
    @MessageBody() data: JoinRoomPayload,
    @ConnectedSocket() client: any,
  ) {
    const { requestId } = data;

    const user = client.handshake.user as AccessTokenPayload;

    if (!this.roomParticipants.has(requestId.toString())) {
      this.roomParticipants.set(requestId.toString(), new Set());
    }

    this.roomParticipants.get(requestId.toString()).add(client.id);
    client.join(requestId);

    console.log(`User ${user.id} joined room: ${requestId}`);
    this.server.to(requestId).emit('userJoined', { user, requestId });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: ConversationMessagePayload,
    @ConnectedSocket() client: any,
  ) {
    const user = client.handshake.user as AccessTokenPayload;
    const { requestId, message } = data;

    if (!this.roomParticipants.has(requestId.toString())) {
      client.emit('error', { message: 'Room not found' });
      return;
    }

    console.log(`Message in room ${requestId} from ${user.id}: ${message}`);
    this.server.to(requestId).emit('message', { user, message });
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(
    @MessageBody() data: JoinRoomPayload,
    @ConnectedSocket() client: any,
  ) {
    const { requestId } = data;

    if (this.roomParticipants.has(requestId.toString())) {
      this.roomParticipants.get(requestId.toString()).delete(client.id);
      client.leave(requestId.toString());

      console.log(`Client ${client.id} left room: ${requestId.toString()}`);
      this.server.to(requestId).emit('userLeft', { userId: client.id });
    }
  }
}

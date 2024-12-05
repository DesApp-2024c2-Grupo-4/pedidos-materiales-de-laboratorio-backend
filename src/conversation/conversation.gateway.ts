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
import { ConversationService } from './conversation.service';
import { RequestDocument } from 'src/schemas/request.schema';
import { Server } from 'socket.io';

export interface JoinRoomPayload {
  requestId: Types.ObjectId;
}

export interface ConversationMessagePayload {
  requestId: Types.ObjectId;
  message: string;
}

export interface ConversationReadPayload {
  requestId: Types.ObjectId;
  messages: Types.ObjectId[];
}

@WebSocketGateway({ cors: true })
@UseGuards(JwtSocketAuthGuard)
@UsePipes(new ValidationPipe())
export class ConversationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private conversationService: ConversationService) {}
  @WebSocketServer() server: Server;

  private roomParticipants: Map<string, Set<string>> = new Map();

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);

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
  async joinRoom(
    @MessageBody() data: JoinRoomPayload,
    @ConnectedSocket() client: any,
  ) {
    const requestId = data.requestId.toString();

    const request = client.handshake.requestDocument as RequestDocument;

    if (!this.roomParticipants.has(requestId)) {
      this.roomParticipants.set(requestId, new Set());
    }

    this.roomParticipants.get(requestId).add(client.id);

    client.join(requestId);

    const conversation = await this.conversationService.get(
      request.conversation,
    );

    this.server
      .to(client.id)
      .emit('roomHistory', { messages: conversation.messages });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: ConversationMessagePayload,
    @ConnectedSocket() client: any,
  ) {
    const user = client.handshake.user as AccessTokenPayload;
    const { message } = data;

    const request = client.handshake.requestDocument as RequestDocument;

    const requestId = request._id.toString();

    if (!this.roomParticipants.has(requestId)) {
      client.emit('error', {
        message: `Room ${requestId} not found`,
      });
      return;
    }

    const newMessage = await this.conversationService.addMessage(
      request.conversation,
      user.id,
      message,
    );

    this.roomParticipants.get(requestId).forEach((c) => {
      if (c === client.id) return;
      this.server.to(c).emit('message', { requestId, message: newMessage });
    });
  }

  @SubscribeMessage('readMessages')
  async handleRead(
    @MessageBody() data: ConversationReadPayload,
    @ConnectedSocket() client: any,
  ) {
    const user = client.handshake.user as AccessTokenPayload;
    const { messages } = data;

    const request = client.handshake.requestDocument as RequestDocument;

    const requestId = request._id.toString();

    if (!this.roomParticipants.has(requestId)) {
      client.emit('error', {
        message: `Room ${requestId} not found`,
      });
      return;
    }

    await this.conversationService.readMessages(
      request.conversation,
      user.id,
      messages,
    );

    this.roomParticipants.get(requestId).forEach((c) => {
      if (c === client.id) return;
      this.server
        .to(c)
        .emit('messageReads', { requestId, userId: user.id, messages });
    });
  }

  @SubscribeMessage('ackMessages')
  async handleDeliver(
    @MessageBody() data: ConversationReadPayload,
    @ConnectedSocket() client: any,
  ) {
    const user = client.handshake.user as AccessTokenPayload;
    const { messages } = data;

    const request = client.handshake.requestDocument as RequestDocument;

    const requestId = request._id.toString();

    if (!this.roomParticipants.has(requestId)) {
      client.emit('error', {
        message: `Room ${requestId} not found`,
      });
      return;
    }

    await this.conversationService.deliverMessages(
      request.conversation,
      user.id,
      messages,
    );

    this.roomParticipants.get(requestId).forEach((c) => {
      if (c === client.id) return;
      this.server
        .to(c)
        .emit('messagesDelivered', { requestId, userId: user.id, messages });
    });
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
      this.server
        .to(requestId.toString())
        .emit('userLeft', { userId: client.id });
    }
  }
}

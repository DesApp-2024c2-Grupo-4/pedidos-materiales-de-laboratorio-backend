import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { JwtSocketAuthGuard } from '../auth/strategies/jwt-socket.guard';

@WebSocketGateway({ cors: true })
@UseGuards(JwtSocketAuthGuard)
export class ConversationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server;

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: any,
  ) {
    const user = client.handshake.user; // Decoded user from token
    this.server.emit('message', { user, message: data.message });
  }
}

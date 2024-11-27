import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException)
export class WsExceptionFilter {
  public catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    this.handleError(client, exception);
  }

  public handleError(client: Socket, exception: WsException) {
    if (exception! instanceof WsException) {
      return;
    }

    console.error({ client, exception });
  }
}

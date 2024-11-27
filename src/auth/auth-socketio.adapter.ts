import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication, Injectable } from '@nestjs/common';
import { ServerOptions } from 'socket.io';

@Injectable()
export class AuthenticatedSocketAdapter extends IoAdapter {
  constructor(private app: INestApplication) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);

    server.use((socket, next) => {
      const token = socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        return next(new Error('Authentication error'));
      }
      // Attach token to socket handshake for further processing
      socket.handshake.query.token = token;
      next();
    });

    return server;
  }
}

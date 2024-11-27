import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AuthenticatedSocketAdapter } from './auth/auth-socketio.adapter';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('PORT') || 3000;

  configureApp(app, config);

  await app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}/`);
  });
}
bootstrap();

export function configureApp(app, config) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enable transformation
      whitelist: true, // Strips out properties that are not in the DTO
    }),
  );

  const allowedOrigins: string[] =
    config.get('CORS_ENABLED_ORIGINS')?.split(';') || [];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useWebSocketAdapter(new AuthenticatedSocketAdapter(app));
}

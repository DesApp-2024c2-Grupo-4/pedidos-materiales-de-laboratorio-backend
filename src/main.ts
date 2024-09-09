import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('PORT') || 3000;
  configureApp(app, config);
  await app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}/`);
  });
}
bootstrap();

function configureApp(app, config) {
  const allowedOrigins = config.get('CORS_ENABLED_ORIGINS').split(';');
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
}

import { ConfigModule, ConfigService } from '@nestjs/config';

export const AccessTokenProvider = {
  global: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
    signOptions: {
      expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRATION') || '24h',
    },
  }),
};

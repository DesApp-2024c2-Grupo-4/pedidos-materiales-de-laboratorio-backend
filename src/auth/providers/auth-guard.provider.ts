import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../strategies/jwt.guard';

export const AuthGuardProvider = {
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
};

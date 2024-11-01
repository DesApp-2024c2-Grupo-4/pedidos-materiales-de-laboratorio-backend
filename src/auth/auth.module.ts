import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { UserDbService } from '../user/user-db.service';
import { AccessTokenProvider } from './providers/auth-token.provider';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { RegisterTokenDbService } from './register-token/register-token-db.service';
import {
  RegisterToken,
  RegisterTokenSchema,
} from '../schemas/register-token.schema';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync(AccessTokenProvider),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: RegisterToken.name, schema: RegisterTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    UserDbService,
    RegisterTokenDbService,
    JwtStrategy,
    LocalStrategy,
    AuthService,
  ],
})
export class AuthModule {}

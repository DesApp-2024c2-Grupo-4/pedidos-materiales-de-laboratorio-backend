import { Module } from '@nestjs/common';
import RegisterService from './register.service';
import AuthController from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [
    RegisterService
  ],
})

export class AuthModule {}
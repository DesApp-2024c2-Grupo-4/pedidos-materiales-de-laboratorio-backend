import { Body, Controller, Post } from '@nestjs/common';
import AuthService from './auth.service';

@Controller('/auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  registerUser(@Body() body: unknown) {
    const user = (body as any).user;
    return this.authService.registerUser(user);
  }
}

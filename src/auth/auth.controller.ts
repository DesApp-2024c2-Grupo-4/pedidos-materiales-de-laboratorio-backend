import { Body, Controller, Post, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategies/local.guard';
import { Public } from './providers/accesor.metadata';
import { CreateUserDto, UserLoginDto } from '../dto/user.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(201)
  @Post('/register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  loginUser(@Body() userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;
    return this.authService.loginUser(email, password);
  }
}

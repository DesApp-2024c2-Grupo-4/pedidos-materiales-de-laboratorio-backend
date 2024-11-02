import {
  Body,
  Controller,
  Post,
  HttpCode,
  UseGuards,
  Request,
  Query,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategies/local.guard';
import { Public } from './providers/accesor.metadata';
import { CreateUserDto, UserLoginDto } from '../dto/user.dto';
import {
  CreateRegisterTokenDto,
  GetRegisterTokenDto,
  RegisterTokenIdDto,
} from '../dto/register-token.dto';
import { AuthenticatedRequest } from '../dto/authenticated-request.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  loginUser(@Body() userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;
    return this.authService.loginUser(email, password);
  }

  @Public()
  @HttpCode(201)
  @Post('/register')
  registerUser(
    @Query() registerTokenIdDto: RegisterTokenIdDto,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.registerUser(
      createUserDto,
      registerTokenIdDto.token,
    );
  }

  @HttpCode(201)
  @Post('/register/token')
  createRegisterToken(
    @Request() req: AuthenticatedRequest,
    @Query() createRegisterTokenDto: CreateRegisterTokenDto,
  ) {
    const { id } = req.user;
    const { createdFor } = createRegisterTokenDto;
    return this.authService.createRegisterToken(id, createdFor);
  }

  @Get('/register/token')
  getRegisterTokens(@Query() getRegisterTokenDto: GetRegisterTokenDto) {
    const { isAvailable } = getRegisterTokenDto;
    return this.authService.getRegisterToken(isAvailable);
  }
}

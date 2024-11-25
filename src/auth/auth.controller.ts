import {
  Body,
  Controller,
  Post,
  HttpCode,
  UseGuards,
  Request,
  Query,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategies/local.guard';
import { AllRoles, Public } from './providers/accesor.metadata';
import { CreateUserDto, UserLoginDto } from '../dto/user.dto';
import {
  CreateRegisterTokenDto,
  RegisterTokenIdDto,
} from './register-token/register-token.dto';
import { AuthenticatedRequest } from '../dto/authenticated-request.dto';
import { Roles } from '../const/roles.const';
import { IsAvailableDto } from '../dto/is-available.dto';

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
  @AllRoles(Roles.ADMIN, Roles.LAB)
  createRegisterToken(
    @Request() req: AuthenticatedRequest,
    @Query() createRegisterTokenDto: CreateRegisterTokenDto,
  ) {
    const { id } = req.user;
    const { createdFor } = createRegisterTokenDto;
    return this.authService.createRegisterToken(id, createdFor);
  }

  @HttpCode(204)
  @AllRoles(Roles.ADMIN, Roles.LAB)
  @Delete('/register/token/:token')
  deleteRegisterToken(
    @Request() req: AuthenticatedRequest,
    @Param() registerTokenIdDto: RegisterTokenIdDto,
  ) {
    const { id } = req.user;
    const { token } = registerTokenIdDto;
    return this.authService.deleteRegisterToken(token, id);
  }

  @Get('/register/token')
  @AllRoles(Roles.ADMIN, Roles.LAB)
  getRegisterTokens(@Query() getRegisterTokenDto: IsAvailableDto) {
    const { isAvailable } = getRegisterTokenDto;
    return this.authService.getRegisterToken(isAvailable);
  }

  @Get('/constants/roles')
  @AllRoles(Roles.ADMIN)
  getRoles() {
    return Roles;
  }
}

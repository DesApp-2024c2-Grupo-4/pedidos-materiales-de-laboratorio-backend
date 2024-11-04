import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { CreateUserDto, UserLoginDto } from '../../dto/user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import { RegisterTokenIdDto } from '../../dto/register-token.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
  };

  const mockRegisterTokenIdDto: RegisterTokenIdDto = {
    token: new Types.ObjectId(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        email: 'john.doe@example.com',
        password: 'password123',
        matricula: 123,
      };

      mockAuthService.registerUser.mockResolvedValue(createUserDto);

      const result = await authController.registerUser(
        mockRegisterTokenIdDto,
        createUserDto,
      );
      expect(result).toEqual(createUserDto);
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(
        createUserDto,
        mockRegisterTokenIdDto.token,
      );
    });

    it('should throw an error if registration fails', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        email: 'john.doe@example.com',
        password: 'password123',
        matricula: 123,
      };

      mockAuthService.registerUser.mockRejectedValue(
        new HttpException('User already exists', HttpStatus.BAD_REQUEST),
      );

      await expect(
        authController.registerUser(mockRegisterTokenIdDto, createUserDto),
      ).rejects.toThrow(HttpException);
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(
        createUserDto,
        mockRegisterTokenIdDto.token,
      );
    });
  });

  describe('loginUser', () => {
    it('should log in a user successfully', async () => {
      const userLoginDto: UserLoginDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const accessToken = { accessToken: 'someToken' };
      mockAuthService.loginUser.mockResolvedValue(accessToken);

      const result = await authController.loginUser(userLoginDto);
      expect(result).toEqual(accessToken);
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(
        userLoginDto.email,
        userLoginDto.password,
      );
    });

    it('should throw an error if login fails', async () => {
      const userLoginDto: UserLoginDto = {
        email: 'john.doe@example.com',
        password: 'wrongPassword',
      };

      mockAuthService.loginUser.mockRejectedValue(
        new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
      );

      await expect(authController.loginUser(userLoginDto)).rejects.toThrow(
        HttpException,
      );
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(
        userLoginDto.email,
        userLoginDto.password,
      );
    });
  });
});

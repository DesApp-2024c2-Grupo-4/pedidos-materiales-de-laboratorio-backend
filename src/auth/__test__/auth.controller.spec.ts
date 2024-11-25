import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { CreateUserDto, UserLoginDto } from '../../user/user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  RegisterTokenIdDto,
  CreateRegisterTokenDto,
} from '../register-token/register-token.dto';
import { AuthenticatedRequest } from '../../dto/authenticated-request.dto';
import { Roles } from '../../const/roles.const';
import { IsAvailableDto } from '../../dto/is-available.dto';

describe('AuthController', () => {
  let authController: AuthController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;

  const mockAuthService = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
    createRegisterToken: jest.fn(),
    deleteRegisterToken: jest.fn(),
    getRegisterToken: jest.fn(),
  };

  const mockRegisterTokenIdDto: RegisterTokenIdDto = {
    token: new Types.ObjectId(),
  };

  const mockCreateRegisterTokenDto: CreateRegisterTokenDto = {
    createdFor: 'test@example.com',
  };

  const mockGetRegisterTokenDto: IsAvailableDto = {
    isAvailable: true,
  };

  const mockUser: AuthenticatedRequest = {
    user: {
      id: 'mock-user-id',
    },
  } as any as AuthenticatedRequest;

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
        licenceNumber: 123,
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
        licenceNumber: 123,
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

  describe('createRegisterToken', () => {
    it('should create a register token successfully', async () => {
      mockAuthService.createRegisterToken.mockResolvedValue({
        token: 'new-token',
      });

      const result = await authController.createRegisterToken(
        mockUser,
        mockCreateRegisterTokenDto,
      );
      expect(result).toEqual({ token: 'new-token' });
      expect(mockAuthService.createRegisterToken).toHaveBeenCalledWith(
        mockUser.user.id,
        mockCreateRegisterTokenDto.createdFor,
      );
    });

    it('should throw an error if creating register token fails', async () => {
      mockAuthService.createRegisterToken.mockRejectedValue(
        new HttpException(
          'Could not create token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      await expect(
        authController.createRegisterToken(
          mockUser,
          mockCreateRegisterTokenDto,
        ),
      ).rejects.toThrow(HttpException);
      expect(mockAuthService.createRegisterToken).toHaveBeenCalledWith(
        mockUser.user.id,
        mockCreateRegisterTokenDto.createdFor,
      );
    });
  });

  describe('deleteRegisterToken', () => {
    it('should delete a register token successfully', async () => {
      mockAuthService.deleteRegisterToken.mockResolvedValue(undefined);

      await authController.deleteRegisterToken(
        mockUser,
        mockRegisterTokenIdDto,
      );
      expect(mockAuthService.deleteRegisterToken).toHaveBeenCalledWith(
        mockRegisterTokenIdDto.token,
        mockUser.user.id,
      );
    });

    it('should throw an error if deleting register token fails', async () => {
      mockAuthService.deleteRegisterToken.mockRejectedValue(
        new HttpException(
          'Could not delete token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      await expect(
        authController.deleteRegisterToken(mockUser, mockRegisterTokenIdDto),
      ).rejects.toThrow(HttpException);
      expect(mockAuthService.deleteRegisterToken).toHaveBeenCalledWith(
        mockRegisterTokenIdDto.token,
        mockUser.user.id,
      );
    });
  });

  describe('getRegisterTokens', () => {
    it('should return register tokens successfully', async () => {
      const tokens = [{ token: 'mock-token', isAvailable: true }];
      mockAuthService.getRegisterToken.mockResolvedValue(tokens);

      const result = await authController.getRegisterTokens(
        mockGetRegisterTokenDto,
      );
      expect(result).toEqual(tokens);
      expect(mockAuthService.getRegisterToken).toHaveBeenCalledWith(
        mockGetRegisterTokenDto.isAvailable,
      );
    });

    it('should throw an error if fetching register tokens fails', async () => {
      mockAuthService.getRegisterToken.mockRejectedValue(
        new HttpException(
          'Could not fetch tokens',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      await expect(
        authController.getRegisterTokens(mockGetRegisterTokenDto),
      ).rejects.toThrow(HttpException);
      expect(mockAuthService.getRegisterToken).toHaveBeenCalledWith(
        mockGetRegisterTokenDto.isAvailable,
      );
    });
  });

  describe('getRoles', () => {
    it('should return roles', () => {
      const result = authController.getRoles();
      expect(result).toEqual(Roles);
    });
  });
});

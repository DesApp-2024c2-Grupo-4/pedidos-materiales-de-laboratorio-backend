import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserDbService } from '../../user/user-db.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../dto/user.dto';
import { BackendException } from '../../shared/backend.exception';
import { HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserDbService;
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    validatePassword: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserDbService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserDbService>(UserDbService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('registerUser', () => {
    it('should throw an error if an error occurs while fetching the user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        email: 'john.doe@example.com',
        password: 'password123',
        matricula: 123,
      };

      mockUserService.findByEmail.mockImplementation(() => {
        throw new BackendException('Database error', HttpStatus.UNAUTHORIZED);
      });

      await expect(authService.registerUser(createUserDto)).rejects.toThrow(
        BackendException,
      );
      await expect(authService.registerUser(createUserDto)).rejects.toThrow(
        `Database error`,
      );
    });
  });

  describe('loginUser', () => {
    it('should throw an error if there is a problem validating the password', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';
      const user = {
        _id: '1',
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        email,
        password: 'hashedPwd',
      };

      mockUserService.findByEmail.mockResolvedValue(user);
      mockUserService.validatePassword.mockImplementation(() => {
        throw new BackendException('Validation error', HttpStatus.UNAUTHORIZED);
      });

      await expect(authService.loginUser(email, password)).rejects.toThrow(
        BackendException,
      );

      await expect(authService.loginUser(email, password)).rejects.toThrow(
        `Cannot validate usar: Validation error`,
      );
    });

    it('should successfully log in a user', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';
      const user = {
        _id: '1',
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        email,
        password: 'hashedPwd',
      };

      mockUserService.findByEmail.mockResolvedValue(user);
      mockUserService.validatePassword.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await authService.loginUser(email, password);
      expect(result).toEqual({ accessToken: 'jwt-token' });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          id: user._id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
        }),
      );
    });
  });
});

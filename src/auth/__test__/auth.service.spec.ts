import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserDbService } from '../../user/user-db.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../dto/user.dto';
import { BackendException } from '../../shared/backend.exception';
import { HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: any;
  let jwtService: any;

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
      const err = new Error(`Database error`);
      userService.findByEmail.mockRejectedValue(err);

      await expect(authService.registerUser(createUserDto)).rejects.toThrow(
        BackendException,
      );
      await expect(authService.registerUser(createUserDto)).rejects.toThrow(
        `Cannot create user ${createUserDto.email}. Reason: ${err}`,
      );
    });

    it('should throw an error if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        email: 'john.doe@example.com',
        password: 'password123',
        matricula: 123,
      };

      userService.findByEmail.mockResolvedValue(createUserDto);

      await expect(authService.registerUser(createUserDto)).rejects.toThrow(
        BackendException,
      );
      await expect(authService.registerUser(createUserDto)).rejects.toThrow(
        `Username ${createUserDto.email} already exists.`,
      );
    });

    it('should throw an error if an error occurs while creating the user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        email: 'john.doe@example.com',
        password: 'password123',
        matricula: 123,
      };

      userService.findByEmail.mockResolvedValue(undefined);

      const err = new Error(`Database error`);

      userService.createUser.mockRejectedValue(err);

      await expect(authService.registerUser(createUserDto)).rejects.toThrow(
        BackendException,
      );
      await expect(authService.registerUser(createUserDto)).rejects.toThrow(
        `Cannot create user ${createUserDto.email}. Reason: ${err}`,
      );
    });

    it('should register user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        email: 'john.doe@example.com',
        password: 'password123',
        matricula: 123,
      };

      userService.findByEmail.mockResolvedValue(undefined);
      userService.createUser.mockResolvedValue(createUserDto);

      await expect(
        authService.registerUser(createUserDto),
      ).resolves.toStrictEqual(createUserDto);
    });
  });

  describe('loginUser', () => {
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

      userService.findByEmail.mockResolvedValue(user);
      userService.validatePassword.mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('jwt-token');

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

    it('should throw an error if password cannot be validated', async () => {
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

      userService.findByEmail.mockResolvedValue(user);
      userService.validatePassword.mockResolvedValue(false);

      await expect(authService.loginUser(email, password)).rejects.toThrow(
        BackendException,
      );

      await expect(authService.loginUser(email, password)).rejects.toThrow(
        `Credentials are invalid`,
      );
    });

    it('should throw an error if password validation rejects', async () => {
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

      const err = new Error('failed');

      userService.findByEmail.mockResolvedValue(user);
      userService.validatePassword.mockRejectedValue(err);

      await expect(authService.loginUser(email, password)).rejects.toThrow(
        BackendException,
      );

      await expect(authService.loginUser(email, password)).rejects.toThrow(
        `Cannot validate user: ${err}`,
      );
    });

    it('should throw an error if user get rejects', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';

      const err = new Error('failed');

      userService.findByEmail.mockRejectedValue(err);

      await expect(authService.loginUser(email, password)).rejects.toThrow(
        BackendException,
      );

      await expect(authService.loginUser(email, password)).rejects.toThrow(
        `Cannot validate user: ${err}`,
      );
    });

    it('should throw an error if no user is found', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';

      const err = new Error('failed');

      userService.findByEmail.mockResolvedValue(undefined);
      userService.validatePassword.mockRejectedValue(err);

      await expect(authService.loginUser(email, password)).rejects.toThrow(
        BackendException,
      );

      await expect(authService.loginUser(email, password)).rejects.toThrow(
        `Credentials are invalid`,
      );
    });
  });
});

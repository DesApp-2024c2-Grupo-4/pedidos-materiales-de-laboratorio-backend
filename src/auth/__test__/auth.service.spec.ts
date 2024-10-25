import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserDbService } from '../../user/user-db.service';
import { JwtService } from '@nestjs/jwt';
import { BackendException } from '../../shared/backend.exception';
import { HttpStatus } from '@nestjs/common';
import { User } from '../../schemas/user.schema';
import { CreateUserDto } from '../../dto/user.dto';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let userDbService: jest.Mocked<UserDbService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserDbService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
            validatePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userDbService = module.get(UserDbService);
    jwtService = module.get(JwtService);
  });

  describe('registerUser', () => {
    it('should throw an error if user already exists', async () => {
      const mockUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'test123',
        name: 'Test',
        lastName: 'User',
        dni: '12345678',
        matricula: 123456,
      };
      userDbService.findByEmail.mockResolvedValueOnce({
        email: 'test@example.com',
      } as User);

      await expect(service.registerUser(mockUserDto)).rejects.toThrow(
        new BackendException(
          `Username ${mockUserDto.email} already exists.`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should create a new user successfully', async () => {
      const mockUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'test123',
        name: 'Test',
        lastName: 'User',
        dni: '12345678',
        matricula: 123456,
      };
      userDbService.findByEmail.mockResolvedValueOnce(null);
      userDbService.createUser.mockResolvedValueOnce({
        email: 'test@example.com',
      } as User);

      const result = await service.registerUser(mockUserDto);
      expect(result.email).toEqual(mockUserDto.email);
    });
  });

  describe('loginUser', () => {
    it('should throw an error if credentials are invalid', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password';
      userDbService.findByEmail.mockResolvedValueOnce(null);

      await expect(service.loginUser(email, password)).rejects.toThrow(
        new BackendException(
          'Credentials are invalid',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should return access token for valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const mockUser: User = {
        _id: new Types.ObjectId(),
        email: 'test@example.com',
        password: 'hashedPwd',
        role: ['user'],
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        matricula: 123456,
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      userDbService.findByEmail.mockResolvedValueOnce(mockUser);
      userDbService.validatePassword.mockResolvedValueOnce(true);
      jwtService.signAsync.mockResolvedValueOnce('fake-token');

      const result = await service.loginUser(email, password);
      expect(result.accessToken).toBe('fake-token');
    });
  });
});

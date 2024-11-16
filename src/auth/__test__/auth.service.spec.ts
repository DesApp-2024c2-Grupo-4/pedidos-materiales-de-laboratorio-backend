import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserDbService } from '../../user/user-db.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../dto/user.dto';
import { BackendException } from '../../shared/backend.exception';
import { Types } from 'mongoose';
import { RegisterTokenDbService } from '../register-token/register-token-db.service';
import { RegisterTokenDocument } from '../../schemas/register-token.schema';
import { IdDto } from '../../dto/id.dto';
import { cantDeleteToken } from '../register-token/register-token.errors';
import { cantCreateUser } from '../../user/user.errors';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: any;
  let registerTokenService: any;
  let jwtService: any;

  const mockRegisterToken = {
    isAvailable: jest.fn(),
    _id: new Types.ObjectId(),
  } as any;

  const mockUserService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    validatePassword: jest.fn(),
  };

  const mockRegisterTokenService = {
    add: jest.fn(),
    getAll: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserDbService, useValue: mockUserService },
        { provide: RegisterTokenDbService, useValue: mockRegisterTokenService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserDbService>(UserDbService);
    registerTokenService = module.get<RegisterTokenDbService>(
      RegisterTokenDbService,
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('registerUser', () => {
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
        registerTokenService.get.mockResolvedValue(mockRegisterToken);

        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).rejects.toThrow(BackendException);
        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).rejects.toThrow(
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
        registerTokenService.get.mockResolvedValue(mockRegisterToken);

        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).rejects.toThrow(BackendException);
        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).rejects.toThrow(`Username ${createUserDto.email} already exists.`);
      });

      it('should throw an error if an error occurs while getting the token', async () => {
        const createUserDto: CreateUserDto = {
          name: 'John',
          lastName: 'Doe',
          dni: 12345678,
          email: 'john.doe@example.com',
          password: 'password123',
          matricula: 123,
        };

        userService.findByEmail.mockResolvedValue(undefined);

        const getTokenErr = new Error('Error getting token');
        registerTokenService.get.mockRejectedValue(getTokenErr);

        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).rejects.toThrow(BackendException);
        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).rejects.toThrow(
          `Cannot create user ${createUserDto.email}. Reason: Error getting token: ${getTokenErr}`,
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

        mockRegisterToken.isAvailable.mockReturnValue(true);
        userService.findByEmail.mockResolvedValue(undefined);
        registerTokenService.get.mockResolvedValue(mockRegisterToken);

        const err = new Error(`Database error`);

        userService.createUser.mockRejectedValue(err);

        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).rejects.toThrow(BackendException);
        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).rejects.toThrow(
          `Cannot create user ${createUserDto.email}. Reason: ${err}`,
        );
      });

      it('should throw an error if token cannot be found', async () => {
        const createUserDto: CreateUserDto = {
          name: 'John',
          lastName: 'Doe',
          dni: 12345678,
          email: 'john.doe@example.com',
          password: 'password123',
          matricula: 123,
        };

        userService.findByEmail.mockResolvedValue(undefined);
        registerTokenService.get.mockResolvedValue(undefined);

        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).rejects.toThrow(BackendException);
        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).rejects.toThrow(
          cantCreateUser(
            createUserDto.email,
            `Token ${mockRegisterToken._id} is not available.`,
          ),
        );
      });

      it('should throw an error if token is not available', async () => {
        const createUserDto: CreateUserDto = {
          name: 'John',
          lastName: 'Doe',
          dni: 12345678,
          email: 'john.doe@example.com',
          password: 'password123',
          matricula: 123,
        };

        mockRegisterToken.isAvailable.mockReturnValue(false);

        userService.findByEmail.mockResolvedValue(undefined);
        registerTokenService.get.mockResolvedValue(mockRegisterToken);

        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).rejects.toThrow(BackendException);
        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).rejects.toThrow(
          cantCreateUser(
            createUserDto.email,
            `Token ${mockRegisterToken._id} is not available.`,
          ),
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

        mockRegisterToken.isAvailable.mockReturnValue(true);

        userService.findByEmail.mockResolvedValue(undefined);
        userService.createUser.mockResolvedValue(createUserDto);
        registerTokenService.get.mockResolvedValue(mockRegisterToken);

        await expect(
          authService.registerUser(createUserDto, mockRegisterToken._id),
        ).resolves.toStrictEqual(createUserDto);
      });
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

  describe('createRegisterToken', () => {
    it('should successfully create a register token', async () => {
      const creatorId = new Types.ObjectId();
      const createdFor = 'user@example.com';
      const tokenIdResponse: IdDto = { id: creatorId };

      mockRegisterTokenService.add.mockResolvedValue(tokenIdResponse);

      const result = await authService.createRegisterToken(
        creatorId,
        createdFor,
      );
      expect(result).toEqual(tokenIdResponse);
      expect(mockRegisterTokenService.add).toHaveBeenCalledWith(
        creatorId,
        createdFor,
      );
    });

    it('should throw an error if an error occurs while creating a register token', async () => {
      const creatorId = new Types.ObjectId();
      const createdFor = 'user@example.com';
      const errorMessage = 'Failed to create token';

      mockRegisterTokenService.add.mockRejectedValue(new Error(errorMessage));

      await expect(
        authService.createRegisterToken(creatorId, createdFor),
      ).rejects.toThrow(BackendException);
      await expect(
        authService.createRegisterToken(creatorId, createdFor),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('getRegisterToken', () => {
    it('should return a list of register tokens', async () => {
      const tokens = [mockRegisterToken];
      mockRegisterTokenService.getAll.mockResolvedValue(tokens);

      const result = await authService.getRegisterToken();
      expect(result).toEqual(tokens);
      expect(mockRegisterTokenService.getAll).toHaveBeenCalledWith(undefined);
    });

    it('should throw an error if an error occurs while retrieving tokens', async () => {
      const errorMessage = 'Failed to get tokens';

      mockRegisterTokenService.getAll.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(authService.getRegisterToken()).rejects.toThrow(
        BackendException,
      );
      await expect(authService.getRegisterToken()).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe('deleteRegisterToken', () => {
    it('should successfully delete a register token', async () => {
      const tokenId = new Types.ObjectId();
      const deletedBy = new Types.ObjectId();

      mockRegisterToken.isAvailable.mockReturnValue(true);

      mockRegisterTokenService.get.mockResolvedValue(mockRegisterToken);
      mockRegisterTokenService.delete.mockResolvedValue(undefined);

      await expect(
        authService.deleteRegisterToken(tokenId, deletedBy),
      ).resolves.toBeUndefined();
      expect(mockRegisterTokenService.get).toHaveBeenCalledWith(tokenId);
      expect(mockRegisterTokenService.delete).toHaveBeenCalledWith(
        tokenId,
        deletedBy,
      );
    });

    it('should throw an error if the token does not exist', async () => {
      const tokenId = new Types.ObjectId();
      const deletedBy = new Types.ObjectId();

      mockRegisterTokenService.get.mockResolvedValue(null);

      await expect(
        authService.deleteRegisterToken(tokenId, deletedBy),
      ).rejects.toThrow(BackendException);
      await expect(
        authService.deleteRegisterToken(tokenId, deletedBy),
      ).rejects.toThrow('');
    });

    it('should throw an error if an error occurs while retrieving the token', async () => {
      const tokenId = new Types.ObjectId();
      const deletedBy = new Types.ObjectId();
      const errorMessage = 'Failed to retrieve token';

      mockRegisterTokenService.get.mockRejectedValue(new Error(errorMessage));

      await expect(
        authService.deleteRegisterToken(tokenId, deletedBy),
      ).rejects.toThrow(BackendException);
      await expect(
        authService.deleteRegisterToken(tokenId, deletedBy),
      ).rejects.toThrow(errorMessage);
    });

    it('should throw an error if an error occurs while deleting the token', async () => {
      const tokenId = new Types.ObjectId();
      const deletedBy = new Types.ObjectId();

      mockRegisterToken.isAvailable.mockReturnValue(true);

      mockRegisterTokenService.get.mockResolvedValue(mockRegisterToken);
      mockRegisterTokenService.delete.mockRejectedValue(
        new Error('Failed to delete token'),
      );

      await expect(
        authService.deleteRegisterToken(tokenId, deletedBy),
      ).rejects.toThrow(BackendException);
      await expect(
        authService.deleteRegisterToken(tokenId, deletedBy),
      ).rejects.toThrow('Failed to delete token');
    });

    it('should throw an error if the token is not available', async () => {
      const deletedBy = new Types.ObjectId();

      mockRegisterToken.isAvailable.mockReturnValue(false);

      const token = {
        ...mockRegisterToken,
        userCreated: new Types.ObjectId(),
      } as any as RegisterTokenDocument;

      registerTokenService.get.mockResolvedValue(token);

      await expect(
        authService.deleteRegisterToken(token._id, deletedBy),
      ).rejects.toThrow(BackendException);

      await expect(
        authService.deleteRegisterToken(token._id, deletedBy),
      ).rejects.toThrow(cantDeleteToken(token._id, `Token is not available.`));
    });
  });
});

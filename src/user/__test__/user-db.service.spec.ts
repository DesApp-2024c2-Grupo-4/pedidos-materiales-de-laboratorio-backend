import { Test, TestingModule } from '@nestjs/testing';
import { UserDbService } from '../user-db.service';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { Connection, Types } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '../../dto/user.dto';
import { IS_SOFT_DELETED_KEY } from '../../schemas/common/soft-delete.schema';
import { cantDelete } from '../user.errors';

describe('UserDbService', () => {
  let service: UserDbService;
  let model: any;
  let connection: any;

  const mockConnection = {
    startSession: jest.fn(),
  } as unknown as Connection;

  const mockRegisterToken = {
    isConsumed: jest.fn(),
    consume: jest.fn(),
    save: jest.fn(),
    _id: new Types.ObjectId(),
  } as any;

  const mockUser = {
    _id: new Types.ObjectId(),
    email: 'test@example.com',
    password: 'test-password',
    name: 'John',
    lastName: 'Doe',
    dni: 12345678,
    matricula: 987654,
    roles: ['admin'],
    comparePassword: jest.fn(),
  };

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDbService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getConnectionToken(),
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<UserDbService>(UserDbService);
    model = module.get(getModelToken(User.name));
    connection = module.get<Connection>(getConnectionToken());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      model.findOne.mockResolvedValue(mockUser);
      const user = await service.findByEmail(mockUser.email);

      expect(model.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(user).toEqual(mockUser);
    });

    it('should throw an error if finding by email fails', async () => {
      const err = new Error('Find error');
      model.findOne.mockRejectedValue(err);
      await expect(service.findByEmail(mockUser.email)).rejects.toStrictEqual(
        `Cannot get user ${mockUser.email}. Reason: ${err}`,
      );
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      model.findOne.mockResolvedValue(mockUser);
      const user = await service.get(mockUser._id);

      expect(model.findOne).toHaveBeenCalledWith({ _id: mockUser._id });
      expect(user).toEqual(mockUser);
    });

    it('should throw an error if finding by id fails', async () => {
      const err = new Error('Find error');
      model.findOne.mockRejectedValue(err);
      await expect(service.get(mockUser._id)).rejects.toStrictEqual(
        `Cannot get user with id ${mockUser._id}. Reason: ${err}`,
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      model.create.mockResolvedValue([mockUser]);
      mockRegisterToken.save.mockResolvedValue(undefined);

      const mockSession = {
        startTransaction: jest.fn(),
        abortTransaction: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        endSession: jest.fn().mockResolvedValue(undefined),
      };

      connection.startSession.mockResolvedValue(mockSession);

      const userDto: CreateUserDto = {
        email: 'john.doe@example.com',
        password: 'test-password',
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        matricula: 987654,
      };
      const userIdDto = await service.createUser(userDto, mockRegisterToken);

      expect(model.create).toHaveBeenCalledWith([userDto], {
        session: mockSession,
      });
      expect(userIdDto).toEqual({ id: mockUser._id });
    });

    it('should throw an error if creating user fails', async () => {
      const err = new Error('Create error');
      model.create.mockRejectedValue(err);

      connection.startSession.mockResolvedValue({
        startTransaction: jest.fn(),
        abortTransaction: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        endSession: jest.fn().mockResolvedValue(undefined),
      });

      const userDto: CreateUserDto = {
        email: 'john.doe@example.com',
        password: 'test-password',
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        matricula: 987654,
      };

      await expect(
        service.createUser(userDto, mockRegisterToken),
      ).rejects.toStrictEqual(
        `Cannot create user ${userDto.email}. Reason: ${err}`,
      );
    });

    it('should throw an error if starting session fails', async () => {
      const err = new Error('Session start error');
      connection.startSession.mockRejectedValue(err);

      const userDto: CreateUserDto = {
        email: 'john.doe@example.com',
        password: 'test-password',
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        matricula: 987654,
      };

      await expect(
        service.createUser(userDto, mockRegisterToken),
      ).rejects.toStrictEqual(
        `Cannot create user ${userDto.email}. Reason: Error starting session: ${err}`,
      );
    });

    it('should throw an error if token save fails', async () => {
      model.create.mockResolvedValue([mockUser]);
      const tokenError = new Error('Token save error');
      mockRegisterToken.save.mockRejectedValue(tokenError);

      const mockSession = {
        startTransaction: jest.fn(),
        abortTransaction: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        endSession: jest.fn().mockResolvedValue(undefined),
      };

      connection.startSession.mockResolvedValue(mockSession);

      const userDto: CreateUserDto = {
        email: 'john.doe@example.com',
        password: 'test-password',
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        matricula: 987654,
      };

      await expect(
        service.createUser(userDto, mockRegisterToken),
      ).rejects.toStrictEqual(
        `Cannot create user ${userDto.email}. Reason: Cannot save token: ${tokenError}`,
      );
    });

    it('should throw an error if committing transaction fails', async () => {
      model.create.mockResolvedValue([mockUser]);
      mockRegisterToken.save.mockResolvedValue(undefined);
      const commitError = new Error('Commit transaction error');

      const mockSession = {
        startTransaction: jest.fn(),
        abortTransaction: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockRejectedValue(commitError),
        endSession: jest.fn().mockResolvedValue(undefined),
      };

      connection.startSession.mockResolvedValue(mockSession);

      const userDto: CreateUserDto = {
        email: 'john.doe@example.com',
        password: 'test-password',
        name: 'John',
        lastName: 'Doe',
        dni: 12345678,
        matricula: 987654,
      };

      await expect(
        service.createUser(userDto, mockRegisterToken),
      ).rejects.toStrictEqual(
        `Cannot create user ${userDto.email}. Reason: Error committing transaction: ${commitError}`,
      );
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      model.find.mockResolvedValue([mockUser]);
      const users = await service.getAll();

      expect(model.find).toHaveBeenCalled();
      expect(users).toEqual([mockUser]);
    });

    it('should throw an error if retrieving all users fails', async () => {
      const err = new Error('GetAll error');
      model.find.mockRejectedValue(err);
      await expect(service.getAll()).rejects.toStrictEqual(
        `Cannot get users. Reason: ${err}`,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      model.updateOne.mockResolvedValue({ modifiedCount: 1 });
      const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };
      await service.update(mockUser._id, updateUserDto);

      expect(model.updateOne).toHaveBeenCalledWith(
        { _id: mockUser._id },
        updateUserDto,
      );
    });

    it('should throw an error if update fails', async () => {
      const err = new Error('Update error');
      model.updateOne.mockRejectedValue(err);
      await expect(
        service.update(mockUser._id, { email: 'updated@example.com' }),
      ).rejects.toStrictEqual(
        `Cannot update user with id ${mockUser._id}. Reason: ${err}`,
      );
    });
  });

  describe('delete', () => {
    const deletedBy = new Types.ObjectId();

    it('should soft delete a user', async () => {
      model.updateOne.mockResolvedValue({ modifiedCount: 1 });
      await service.delete(mockUser._id, deletedBy);

      const softDelete = {
        [IS_SOFT_DELETED_KEY]: true,
        deletedBy,
        deletionDate: expect.any(Date),
      };

      expect(model.updateOne).toHaveBeenCalledWith(
        { _id: mockUser._id },
        { $set: softDelete },
      );
    });

    it('should throw an error if delete fails', async () => {
      const err = new Error('Delete error');
      model.updateOne.mockRejectedValue(err);
      await expect(
        service.delete(mockUser._id, deletedBy),
      ).rejects.toStrictEqual(cantDelete(mockUser._id, err));
    });
  });

  describe('validatePassword', () => {
    it('should return true if password is valid', async () => {
      mockUser.comparePassword.mockResolvedValueOnce(true);
      const isValid = await service.validatePassword(mockUser, 'password');
      expect(isValid).toBe(true);
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password');
    });

    it('should return false if password is invalid', async () => {
      mockUser.comparePassword.mockResolvedValueOnce(false);
      const isValid = await service.validatePassword(mockUser, 'wrongpassword');
      expect(isValid).toBe(false);
      expect(mockUser.comparePassword).toHaveBeenCalledWith('wrongpassword');
    });
  });
});

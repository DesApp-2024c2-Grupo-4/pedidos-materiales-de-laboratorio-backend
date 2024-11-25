import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserDbService } from '../user-db.service';
import { BackendException } from '../../shared/backend.exception';
import { Types } from 'mongoose';
import { UpdateUserDto } from '../user.dto';
import { IS_SOFT_DELETED_KEY } from '../../schemas/common/soft-delete.schema';

describe('UserService', () => {
  let userService: UserService;
  let userDbService: UserDbService;

  const mockUserDbService = {
    update: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserDbService, useValue: mockUserDbService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userDbService = module.get<UserDbService>(UserDbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should call update on the database service and not throw an error', async () => {
      const id = new Types.ObjectId();
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      mockUserDbService.update.mockResolvedValue(null);

      await userService.update(id, updateUserDto);

      expect(userDbService.update).toHaveBeenCalledWith(id, updateUserDto);
    });

    it('should throw BackendException on error', async () => {
      const id = new Types.ObjectId();
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const error = new Error('Update failed');
      mockUserDbService.update.mockRejectedValue(error);

      await expect(userService.update(id, updateUserDto)).rejects.toThrow(
        new BackendException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('get', () => {
    it('should return user if found', async () => {
      const id = new Types.ObjectId();
      const mockUser = { id, name: 'John Doe' };
      mockUserDbService.get.mockResolvedValue(mockUser);

      const result = await userService.get(id);

      expect(result).toEqual(mockUser);
      expect(userDbService.get).toHaveBeenCalledWith(id);
    });

    it('should throw BackendException if user not found', async () => {
      const id = new Types.ObjectId();
      mockUserDbService.get.mockRejectedValue(null);

      await expect(userService.get(id)).rejects.toThrow(
        new BackendException('', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw BackendException on error', async () => {
      const id = new Types.ObjectId();
      const error = new Error('Get failed');
      mockUserDbService.get.mockRejectedValue(error);

      await expect(userService.get(id)).rejects.toThrow(
        new BackendException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const mockUsers = [{ name: 'John Doe' }];
      mockUserDbService.getAll.mockResolvedValue(mockUsers);

      const result = await userService.getAll();

      expect(result).toEqual(mockUsers);
      expect(userDbService.getAll).toHaveBeenCalled();
    });

    it('should throw BackendException on error', async () => {
      const error = new Error('Get all failed');
      mockUserDbService.getAll.mockRejectedValue(error);

      await expect(userService.getAll()).rejects.toThrow(
        new BackendException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('delete', () => {
    const deletedBy = new Types.ObjectId();

    it('should call delete on the database service and not throw an error', async () => {
      const id = new Types.ObjectId();
      const mockUser = {
        [IS_SOFT_DELETED_KEY]: false,
        save: jest.fn(),
      };
      mockUserDbService.delete.mockResolvedValue(null);
      mockUserDbService.get.mockResolvedValue(mockUser);

      await userService.delete(id, deletedBy);

      expect(userDbService.delete).toHaveBeenCalledWith(mockUser, deletedBy);
    });

    it('should throw BackendException on get error', async () => {
      const id = new Types.ObjectId();
      const error = new Error('Delete failed');
      mockUserDbService.delete.mockRejectedValue(error);
      mockUserDbService.get.mockRejectedValue(error);

      await expect(userService.delete(id, deletedBy)).rejects.toThrow(
        new BackendException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });

    it('should throw 404 when item is already soft deleted', async () => {
      const id = new Types.ObjectId();

      const mockSoftDeleted = {
        [IS_SOFT_DELETED_KEY]: true,
        save: jest.fn(),
      };
      mockUserDbService.get.mockResolvedValue(mockSoftDeleted);

      await expect(userService.delete(id, deletedBy)).rejects.toThrow(
        BackendException,
      );
    });

    it('should throw BackendException on save error', async () => {
      const id = new Types.ObjectId();
      const error = new Error('Delete failed');
      mockUserDbService.delete.mockRejectedValue(error);
      mockUserDbService.get.mockResolvedValue({
        [IS_SOFT_DELETED_KEY]: false,
        save: jest.fn(),
      });

      await expect(userService.delete(id, deletedBy)).rejects.toThrow(
        new BackendException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});

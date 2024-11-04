import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { IdDto } from '../../dto/id.dto';
import { UpdateUserDto } from '../../dto/user.dto';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../../dto/authenticated-request.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockAuthenticatedRequest = {
    user: {
      id: new Types.ObjectId(),
    },
  } as AuthenticatedRequest;

  const mockUserService = {
    update: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should call userService.update with correct parameters', async () => {
      const idDto: IdDto = { id: new Types.ObjectId() };
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      mockUserService.update.mockResolvedValue(undefined);

      await userController.update(idDto, updateUserDto);

      expect(userService.update).toHaveBeenCalledWith(idDto.id, updateUserDto);
    });
  });

  describe('get', () => {
    it('should call userService.get with correct id and return user', async () => {
      const idDto: IdDto = { id: new Types.ObjectId() };
      const mockUser = { id: idDto.id, name: 'John Doe' };
      mockUserService.get.mockResolvedValue(mockUser);

      const result = await userController.get(idDto);

      expect(userService.get).toHaveBeenCalledWith(idDto.id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getAll', () => {
    it('should call userService.getAll and return all users', async () => {
      const mockUsers = [{ name: 'John Doe' }];
      mockUserService.getAll.mockResolvedValue(mockUsers);

      const result = await userController.getAll();

      expect(userService.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('delete', () => {
    it('should call userService.delete with correct id', async () => {
      const idDto: IdDto = { id: new Types.ObjectId() };
      mockUserService.delete.mockResolvedValue(undefined);

      await userController.delete(mockAuthenticatedRequest, idDto);

      expect(userService.delete).toHaveBeenCalledWith(
        idDto.id,
        mockAuthenticatedRequest.user.id,
      );
    });
  });
});

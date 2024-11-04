import { Test, TestingModule } from '@nestjs/testing';
import { RegisterTokenDbService } from '../register-token-db.service';
import { getModelToken } from '@nestjs/mongoose';
import { RegisterToken } from '../../../schemas/register-token.schema';
import { Types } from 'mongoose';
import {
  cantCreateToken,
  cantDeleteToken,
  cantGetToken,
  cantGetTokenById,
} from '../register-token.errors';

describe('RegisterTokenDbService', () => {
  let service: RegisterTokenDbService;
  let model: any;

  const mockToken = {
    _id: new Types.ObjectId(),
    creatorId: new Types.ObjectId(),
    createdFor: 'some-user',
    userCreated: undefined,
    isSoftDeleted: false,
    save: jest.fn(),
  };

  const mockRegisterTokenModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterTokenDbService,
        {
          provide: getModelToken(RegisterToken.name),
          useValue: mockRegisterTokenModel,
        },
      ],
    }).compile();

    service = module.get<RegisterTokenDbService>(RegisterTokenDbService);
    model = module.get(getModelToken(RegisterToken.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should successfully create a register token', async () => {
      mockRegisterTokenModel.create.mockResolvedValue(mockToken);
      const result = await service.add(
        mockToken.creatorId,
        mockToken.createdFor,
      );
      expect(model.create).toHaveBeenCalledWith({
        creatorId: mockToken.creatorId,
        createdFor: mockToken.createdFor,
      });
      expect(result).toEqual({ id: mockToken._id });
    });

    it('should throw an error if token creation fails', async () => {
      const error = new Error('Create error');
      mockRegisterTokenModel.create.mockRejectedValue(error);
      await expect(service.add(mockToken.creatorId)).rejects.toEqual(
        cantCreateToken(error),
      );
    });
  });

  describe('getAll', () => {
    it('should retrieve all register tokens', async () => {
      mockRegisterTokenModel.find.mockResolvedValue([mockToken]);
      const result = await service.getAll();
      expect(model.find).toHaveBeenCalledWith({});
      expect(result).toEqual([mockToken]);
    });

    it('should throw an error if retrieval fails', async () => {
      const error = new Error('Get error');
      mockRegisterTokenModel.find.mockRejectedValue(error);
      await expect(service.getAll()).rejects.toEqual(cantGetToken(error));
    });

    it('should filter available tokens', async () => {
      mockRegisterTokenModel.find.mockResolvedValue([mockToken]);
      const result = await service.getAll(true);
      expect(model.find).toHaveBeenCalledWith({
        userCreated: { $exists: false },
        isSoftDeleted: { $exists: false },
      });
      expect(result).toEqual([mockToken]);
    });

    it('should filter unavailable tokens', async () => {
      mockRegisterTokenModel.find.mockResolvedValue([mockToken]);
      const result = await service.getAll(false);
      expect(model.find).toHaveBeenCalledWith({
        $or: [
          { userCreated: { $exists: true, $ne: '' } },
          { isSoftDeleted: { $exists: true, $eq: true } },
        ],
      });
      expect(result).toEqual([mockToken]);
    });
  });

  describe('get', () => {
    it('should retrieve a token by ID', async () => {
      mockRegisterTokenModel.findById.mockResolvedValue(mockToken);
      const result = await service.get(mockToken._id);
      expect(model.findById).toHaveBeenCalledWith(mockToken._id);
      expect(result).toEqual(mockToken);
    });

    it('should throw an error if retrieval by ID fails', async () => {
      const error = new Error('Find error');
      mockRegisterTokenModel.findById.mockRejectedValue(error);
      await expect(service.get(mockToken._id)).rejects.toEqual(
        cantGetTokenById(mockToken._id, error),
      );
    });
  });

  describe('delete', () => {
    it('should soft delete a token', async () => {
      const deletedBy = new Types.ObjectId();
      mockRegisterTokenModel.updateOne.mockResolvedValue({ nModified: 1 });
      await service.delete(mockToken._id, deletedBy);
      expect(model.updateOne).toHaveBeenCalledWith(
        {
          _id: mockToken._id,
          userCreated: { $exists: false },
          isSoftDeleted: { $exists: false },
        },
        {
          $set: {
            isSoftDeleted: true,
            deletedBy,
            deletionDate: expect.any(Date),
          },
        },
      );
    });

    it('should throw an error if deletion fails', async () => {
      const error = new Error('Delete error');
      mockRegisterTokenModel.updateOne.mockRejectedValue(error);
      await expect(
        service.delete(mockToken._id, mockToken.creatorId),
      ).rejects.toEqual(cantDeleteToken(mockToken._id, error));
    });
  });

  describe('filterByAvailability', () => {
    it('should return a query for available tokens', () => {
      const result = service.filterByAvailability(true);
      expect(result).toEqual({
        userCreated: { $exists: false },
        isSoftDeleted: { $exists: false },
      });
    });

    it('should return a query for unavailable tokens', () => {
      const result = service.filterByAvailability(false);
      expect(result).toEqual({
        $or: [
          { userCreated: { $exists: true, $ne: '' } },
          { isSoftDeleted: { $exists: true, $eq: true } },
        ],
      });
    });

    it('should return an empty query for undefined availability', () => {
      const result = service.filterByAvailability(undefined);
      expect(result).toEqual({});
    });
  });
});

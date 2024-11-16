import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { ReactiveDbService } from '../reactive-db.service';
import { Reactive } from '../../schemas/requestable/reactive.schema';
import { UpdateReactivelDto } from '../../dto/reactive.dto';
import {
  cantCreateReactive,
  cantGetRactives,
  cantGetReactive,
  cantUpdateReactive,
  cantDeleteReactive,
} from '../reactive.errors';
import { IS_SOFT_DELETED_KEY } from '../../schemas/common/soft-delete.schema';

describe('ReactiveDbService', () => {
  let service: ReactiveDbService;
  let model: any;

  const mockReactiveModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockReactive = {
    _id: new Types.ObjectId(),
    description: 'test-description',
    cas: 'test-cas',
    stock: 50,
    isAvailable: true,
    isSoftDeleted: false,
    hasEnoughStockAvailable: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactiveDbService,
        {
          provide: getModelToken(Reactive.name),
          useValue: mockReactiveModel,
        },
      ],
    }).compile();

    service = module.get<ReactiveDbService>(ReactiveDbService);
    model = module.get<Model<Reactive>>(getModelToken(Reactive.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should create a new reactive and return its ID', async () => {
      model.create.mockResolvedValue(new Types.ObjectId());

      const result = await service.add(mockReactive);
      expect(isValidObjectId(result)).toBeTruthy();
      expect(mockReactiveModel.create).toHaveBeenCalledWith(mockReactive);
    });

    it('should reject if fails to add', async () => {
      const error = new Error('Cannot add');
      model.create.mockRejectedValue(error);

      await expect(service.add(mockReactive)).rejects.toStrictEqual(
        cantCreateReactive(error),
      );

      expect(mockReactiveModel.create).toHaveBeenCalledWith(mockReactive);
    });
  });

  describe('getAll', () => {
    const unavailableDoc = { ...mockReactive, [IS_SOFT_DELETED_KEY]: true };

    it('should return an array of available reactives', async () => {
      model.find.mockResolvedValue([mockReactive, unavailableDoc]);

      const result = await service.getAll(true);

      expect(result).toEqual([mockReactive]);
    });

    it('should return an array of unavailable reactives', async () => {
      model.find.mockResolvedValue([mockReactive, unavailableDoc]);

      const result = await service.getAll(false);

      expect(result).toStrictEqual([unavailableDoc]);
    });

    it('should return an array with all reactives', async () => {
      model.find.mockResolvedValue([mockReactive, unavailableDoc]);

      const result = await service.getAll();

      expect(result).toStrictEqual([mockReactive, unavailableDoc]);
    });

    it('should throw an error when retrieval fails', async () => {
      const error = new Error('Retrieval failed');
      model.find.mockRejectedValue(error);

      await expect(service.getAll(true)).rejects.toStrictEqual(
        cantGetRactives(error),
      );
    });
  });

  describe('get', () => {
    it('should return a reactive by ID', async () => {
      const mockReactive = { _id: new Types.ObjectId(), name: 'Test Reactive' };
      mockReactiveModel.findById.mockResolvedValue(mockReactive);

      const result = await service.get(mockReactive._id);
      expect(result).toEqual(mockReactive);
      expect(mockReactiveModel.findById).toHaveBeenCalledWith(mockReactive._id);
    });

    it('should reject if fails to get', async () => {
      const error = new Error('Cannot get');
      const mockReactive = { _id: new Types.ObjectId(), name: 'Test Reactive' };
      model.findById.mockRejectedValue(error);

      await expect(service.get(mockReactive._id)).rejects.toStrictEqual(
        cantGetReactive(mockReactive._id, error),
      );

      expect(mockReactiveModel.findById).toHaveBeenCalledWith(mockReactive._id);
    });
  });

  describe('update', () => {
    it('should update a reactive by ID', async () => {
      const mockId = new Types.ObjectId();
      const updateData: UpdateReactivelDto = {
        description: 'Updated Reactive',
      };
      mockReactiveModel.updateOne.mockResolvedValue({ nModified: 1 });

      await service.update(mockId, updateData);
      expect(mockReactiveModel.updateOne).toHaveBeenCalledWith(
        { _id: mockId },
        updateData,
        { new: true },
      );
    });

    it('should reject if fails to update', async () => {
      const error = new Error('Cannot update');
      const id = new Types.ObjectId();
      model.updateOne.mockRejectedValue(error);

      const updateData: UpdateReactivelDto = {
        description: 'Updated Reactive',
      };

      await expect(service.update(id, updateData)).rejects.toStrictEqual(
        cantUpdateReactive(id, error),
      );

      expect(mockReactiveModel.updateOne).toHaveBeenCalledWith(
        { _id: id },
        updateData,
        { new: true },
      );
    });
  });

  describe('delete', () => {
    const deletedBy = new Types.ObjectId();

    it('should soft delete a user', async () => {
      mockReactive.save.mockResolvedValue(true);
      await service.delete(mockReactive as any, deletedBy);
      expect(mockReactive.save).toHaveBeenCalled();
    });

    it('should throw an error if delete fails', async () => {
      const err = new Error('Failed to save');
      mockReactive.save.mockRejectedValue(err);
      await expect(
        service.delete(mockReactive as any, deletedBy),
      ).rejects.toStrictEqual(cantDeleteReactive(mockReactive._id, err));
    });
  });
});
